use std::sync::Arc;

use async_trait::async_trait;
use sqlx::{Postgres, QueryBuilder};
use thiserror::Error;
use tokio::fs::{remove_file, write};
use uuid::Uuid;

use crate::{
    database::IDatabase,
    model::{
        requests::game::{AddGameRequest, EditGameRequest, GamePaginationInternal, OrderField},
        responses::game::{GameDetails, GameSummary},
    },
    utils::clean_duplicate,
};

#[derive(Error, Debug)]
pub enum GameServiceErr {
    #[error(transparent)]
    Other(#[from] anyhow::Error),
}

#[async_trait]
pub trait IGameService {
    async fn filter(
        &self,
        pagination: GamePaginationInternal,
    ) -> Result<Vec<GameSummary>, GameServiceErr>;
    async fn get_by_id(
        &self,
        id: Uuid,
        user_id: Option<i64>,
    ) -> Result<Option<GameDetails>, GameServiceErr>;
    async fn add(
        &self,
        author_id: i64,
        author_name: String,
        game: AddGameRequest,
        rom_bytes: &[u8],
    ) -> Result<(), GameServiceErr>;
    async fn delete(&self, id: Uuid) -> Result<(), GameServiceErr>;
    async fn existed(&self, id: Uuid, author_id: i64) -> Result<bool, GameServiceErr>;
    async fn edit(
        &self,
        game: EditGameRequest,
        rom_bytes: Option<&[u8]>,
        game_id: Uuid,
        user_id: i64,
    ) -> Result<GameDetails, GameServiceErr>;
    async fn get_tags(&self) -> Result<Vec<Option<String>>, GameServiceErr>;
}

pub struct GameService<T: IDatabase> {
    db: Arc<T>,
    rom_dir: String,
}

impl<T> GameService<T>
where
    T: IDatabase,
{
    pub fn new(db: Arc<T>, rom_dir: String) -> Self {
        Self { db, rom_dir }
    }

    async fn write_rom(&self, id: Uuid, rom_bytes: &[u8]) -> Result<String, GameServiceErr> {
        let rom_path_abs = format!("{}/{}", self.rom_dir, id);
        write(&rom_path_abs, rom_bytes)
            .await
            .map_err(|e| GameServiceErr::Other(e.into()))?;
        let seq_path = rom_path_abs.split('/').rev().take(2).collect::<Vec<_>>();
        Ok(format!("{}/{}", seq_path[1], seq_path[0]))
    }

    async fn del_rom(&self, id: Uuid) -> Result<(), GameServiceErr> {
        let rom_path_abs = format!("{}/{}", self.rom_dir, id);
        remove_file(rom_path_abs)
            .await
            .map_err(|e| GameServiceErr::Other(e.into()))
    }
}

#[async_trait]
impl<T> IGameService for GameService<T>
where
    T: IDatabase + Send + Sync,
{
    async fn filter(
        &self,
        pagination: GamePaginationInternal,
    ) -> Result<Vec<GameSummary>, GameServiceErr> {
        let mut query_builder: QueryBuilder<Postgres> = QueryBuilder::new("");
        let mut separated = query_builder.separated(" ");
        separated.push("select id, name, author_id, author_name, avatar_url, up_votes, down_votes from games where 1 = 1");

        if let Some(author_id) = pagination.author_id {
            separated.push("and author_id =");
            separated.push_bind(author_id);
        }

        if let Some(tag) = pagination.tag {
            separated.push("and");
            separated.push_bind(tag);
            separated.push("= any(tags)");
        }

        separated.push(format!("order by {}", pagination.order_field));

        if pagination.order_field == OrderField::Name {
            separated.push("collate \"en-US-x-icu\"");
        };

        separated.push(format!("{}", pagination.order_by));

        separated.push("offset");
        separated.push_bind(pagination.offset);
        separated.push("limit");
        separated.push_bind(pagination.limit);

        query_builder
            .build_query_as::<GameSummary>()
            .fetch_all(self.db.get_pool())
            .await
            .map_err(|e| GameServiceErr::Other(e.into()))
    }

    async fn get_by_id(
        &self,
        id: Uuid,
        user_id: Option<i64>,
    ) -> Result<Option<GameDetails>, GameServiceErr> {
        sqlx::query_as!(
            GameDetails,
            r#"
            select
                games.*,
                users.avatar as author_avatar,
                case
                    when $1 is not null then votes.is_up
                    else null
                end as is_up_voted
            from
                games
            left join
                votes on games.id = votes.game_id and votes.user_id = $1
            left join
                users on games.author_id = users.id
            where
                games.id = $2;
            "#,
            user_id,
            id
        )
        .fetch_optional(self.db.get_pool())
        .await
        .map_err(|e| GameServiceErr::Other(e.into()))
    }

    async fn add(
        &self,
        author_id: i64,
        author_name: String,
        game: AddGameRequest,
        rom_bytes: &[u8],
    ) -> Result<(), GameServiceErr> {
        let mut tx = self
            .db
            .get_pool()
            .begin()
            .await
            .map_err(|e| GameServiceErr::Other(e.into()))?;

        let game = sqlx::query!(
            "insert into games
            (name, author_id, author_name, url, avatar_url, about, info, tags, rom) values
            ($1, $2, $3, $4, $5, $6, $7, $8, '')
            returning id, name",
            game.name,
            author_id,
            author_name,
            game.url,
            game.avatar_url,
            game.about,
            game.info,
            &clean_duplicate(game.tags),
        )
        .fetch_one(&mut *tx)
        .await
        .map_err(|e| GameServiceErr::Other(e.into()))?;

        let rom_path = self.write_rom(game.id, rom_bytes).await?;

        sqlx::query!("update games set rom = $1 where id = $2", rom_path, game.id)
            .execute(&mut *tx)
            .await
            .map_err(|e| GameServiceErr::Other(e.into()))?;

        sqlx::query!(
            "insert into activities (user_id, target_type, target_id, memo) values ($1, 'added_game', $2, $3)",
            author_id,
            game.id,
            format!("Name: {}", game.name)
        )
        .execute(&mut *tx)
        .await
        .map_err(|e| GameServiceErr::Other(e.into()))?;

        tx.commit()
            .await
            .map_err(|e| GameServiceErr::Other(e.into()))
    }

    async fn delete(&self, id: Uuid) -> Result<(), GameServiceErr> {
        self.del_rom(id).await?;

        sqlx::query!("delete from games where id = $1;", id)
            .execute(self.db.get_pool())
            .await
            .map(|_| ())
            .map_err(|e| GameServiceErr::Other(e.into()))
    }

    async fn existed(&self, id: Uuid, author_id: i64) -> Result<bool, GameServiceErr> {
        sqlx::query!(
            "select count(*) as game_count from games where id = $1 and author_id = $2",
            id,
            author_id
        )
        .fetch_one(self.db.get_pool())
        .await
        .map(|result| result.game_count.map(|c| c > 0).unwrap_or(false))
        .map_err(|e| GameServiceErr::Other(e.into()))
    }

    async fn edit(
        &self,
        game: EditGameRequest,
        rom_bytes: Option<&[u8]>,
        game_id: Uuid,
        user_id: i64,
    ) -> Result<GameDetails, GameServiceErr> {
        let mut tx = self
            .db
            .get_pool()
            .begin()
            .await
            .map_err(|e| GameServiceErr::Other(e.into()))?;

        sqlx::query!(
            "update games set
            name = $1, url = $2, avatar_url = $3, about = $4, info = $5, tags = $6, updated_at = now() where id = $7",
            game.name,
            game.url,
            game.avatar_url,
            game.about,
            game.info,
            &clean_duplicate(game.tags),
            game_id
        )
        .execute(&mut *tx)
        .await
        .map_err(|e| GameServiceErr::Other(e.into()))?;

        if let Some(bytes) = rom_bytes {
            let rom_path = self.write_rom(game_id, bytes).await?;

            sqlx::query!("update games set rom = $1 where id = $2", rom_path, game_id)
                .execute(&mut *tx)
                .await
                .map_err(|e| GameServiceErr::Other(e.into()))?;
        }

        sqlx::query!(
            "insert into activities (user_id, target_type, target_id, memo) values ($1, 'updated_game', $2, $3)",
            user_id,
            game_id,
            game.memo
        )
        .execute(&mut *tx)
        .await
        .map_err(|e| GameServiceErr::Other(e.into()))?;

        tx.commit()
            .await
            .map_err(|e| GameServiceErr::Other(e.into()))?;

        self.get_by_id(game_id, Some(user_id))
            .await
            .map(|g| g.unwrap_or_default())
    }

    async fn get_tags(&self) -> Result<Vec<Option<String>>, GameServiceErr> {
        sqlx::query_scalar!("select distinct unnest(tags) AS tag FROM games")
            .fetch_all(self.db.get_pool())
            .await
            .map_err(|e| GameServiceErr::Other(e.into()))
    }
}

#[cfg(test)]
mod tests {
    use sqlx::Pool;

    use super::*;
    use crate::database::{entities::activity::ActivityType, Database};

    #[sqlx::test]
    async fn add_game(pool: Pool<Postgres>) {
        let service: &dyn IGameService =
            &GameService::new(Arc::new(Database::new(pool.clone())), "./roms".into());

        service
            .add(
                40195902,
                "tnht95".into(),
                AddGameRequest {
                    name: "game_name".into(),
                    url: Some("game_url".into()),
                    avatar_url: Some("game_avatar_url".into()),
                    about: Some("game_about".into()),
                    info: Some("game_info".into()),
                    tags: Some(vec!["game_tags".into()]),
                    memo: "game_memo".into(),
                },
                &[1, 2, 3, 4, 5],
            )
            .await
            .unwrap();

        let game = sqlx::query!("select * from games order by created_at desc limit 1")
            .fetch_one(&pool)
            .await
            .unwrap();

        assert_eq!(game.name, "game_name");
        assert_eq!(game.author_name, "tnht95");
        assert_eq!(game.author_id, 40195902);
        assert_eq!(game.url, Some("game_url".into()));
        assert_eq!(game.avatar_url, Some("game_avatar_url".into()));
        assert_eq!(game.about, Some("game_about".into()));
        assert_eq!(game.info, Some("game_info".into()));
        assert_eq!(game.up_votes, 0);
        assert_eq!(game.down_votes, 0);
        assert_eq!(game.tags, Some(vec!["game_tags".into()]));
        assert_eq!(game.rom, format!("roms/{}", game.id));

        let activity = sqlx::query!(
            r#"select
                user_id,
                target_type as "target_type!: ActivityType",
                target_id,
                memo
            from activities
            order by created_at desc limit 1"#
        )
        .fetch_one(&pool)
        .await
        .unwrap();

        assert_eq!(activity.user_id, 40195902);
        assert_eq!(activity.target_type, ActivityType::AddedGame);
        assert_eq!(activity.target_id, game.id);
        assert_eq!(activity.memo, "Name: game_name");

        let rom = tokio::fs::read(format!("./roms/{}", game.id))
            .await
            .unwrap();
        assert_eq!(rom, vec![1, 2, 3, 4, 5]);
    }

    #[sqlx::test]
    async fn edit_game(pool: Pool<Postgres>) {
        let service: &dyn IGameService =
            &GameService::new(Arc::new(Database::new(pool.clone())), "./roms".into());

        sqlx::query!("INSERT INTO games (id, name, author_name, author_id, url, avatar_url, about, info, rom)
                      VALUES ('4d956893-2ced-42c4-8489-fb84c04c9d8f', 'Your Game Name', 'tnht95', 40195902, 'https://example.com', 'https://avatar.example.com', 'About the game', 'Game information', 'path/to/your/rom_file.bin');")
            .execute(&pool)
            .await
            .unwrap();

        service
            .edit(
                EditGameRequest {
                    name: "new".into(),
                    url: Some("game_url".into()),
                    avatar_url: Some("game_avatar_url".into()),
                    about: Some("game_about".into()),
                    info: Some("game_info".into()),
                    tags: None,
                    memo: "game_memo".into(),
                },
                Some(&[1, 2, 3, 4, 5]),
                "4d956893-2ced-42c4-8489-fb84c04c9d8f".parse().unwrap(),
                40195902,
            )
            .await
            .unwrap();

        let game =
            sqlx::query!("select * from games where id = '4d956893-2ced-42c4-8489-fb84c04c9d8f'")
                .fetch_one(&pool)
                .await
                .unwrap();

        assert_eq!(game.name, "new");
        assert_eq!(game.author_name, "tnht95");
        assert_eq!(game.author_id, 40195902);
    }

    #[sqlx::test]
    async fn delete_game(pool: Pool<Postgres>) {
        let service: &dyn IGameService =
            &GameService::new(Arc::new(Database::new(pool.clone())), "./roms".into());

        service
            .add(
                40195902,
                "tnht95".into(),
                AddGameRequest {
                    name: "game_name".into(),
                    url: Some("game_url".into()),
                    avatar_url: Some("game_avatar_url".into()),
                    about: Some("game_about".into()),
                    info: Some("game_info".into()),
                    tags: Some(vec!["game_tags".into()]),
                    memo: "game_memo".into(),
                },
                &[1, 2, 3, 4, 5],
            )
            .await
            .unwrap();

        let game = sqlx::query!("select * from games order by created_at desc limit 1")
            .fetch_one(&pool)
            .await
            .unwrap();

        service.delete(game.id).await.unwrap();

        let game = sqlx::query!("select * from games where id = $1", game.id)
            .fetch_optional(&pool)
            .await
            .unwrap();

        assert!(game.is_none());
    }
}
