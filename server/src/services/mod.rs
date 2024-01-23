use crate::{
    database::Database,
    services::{
        book::{BookService, IBookService},
        game::{GameService, IGameService},
        health::{HealthService, IHealthService},
        post::{IPostService, PostService},
        user::{IUserService, UserService},
    },
};

pub mod book;
pub mod game;
pub mod health;
pub mod post;
pub mod user;

pub trait IInternalServices {
    type THealthService: IHealthService + Send + Sync;
    type TBookService: IBookService + Send + Sync;
    type TUserService: IUserService + Send + Sync;
    type TGameService: IGameService + Send + Sync;
    type TPostService: IPostService + Send + Sync;
}

pub struct InternalServices;
impl IInternalServices for InternalServices {
    type THealthService = HealthService<Database>;
    type TBookService = BookService<Database>;
    type TUserService = UserService<Database>;
    type TGameService = GameService<Database>;
    type TPostService = PostService<Database>;
}
