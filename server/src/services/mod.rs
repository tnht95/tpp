use tokio::sync::RwLock;

use crate::{
    cache::Cache,
    database::Database,
    services::{
        activity::{ActivityService, IActivityService},
        auth::{AuthService, IAuthService},
        blog::{BlogService, IBlogService},
        comment::{CommentService, ICommentService},
        discussion::{DiscussionService, IDiscussionService},
        game::{GameService, IGameService},
        health::{HealthService, IHealthService},
        like::{ILikeService, LikeService},
        post::{IPostService, PostService},
        search::{ISearchService, SearchService},
        subscribe::{ISubscribeService, SubscribeService},
        user::{IUserService, UserService},
        vote::{IVoteService, VoteService},
    },
};

pub mod activity;
pub mod auth;
pub mod blog;
pub mod comment;
pub mod discussion;
pub mod game;
pub mod health;
pub mod like;
pub mod post;
pub mod search;
pub mod subscribe;
pub mod user;
pub mod vote;

pub trait IInternalServices {
    type THealthService: IHealthService + Send + Sync;
    type TAuthService: IAuthService + Send + Sync;
    type TUserService: IUserService + Send + Sync;
    type TGameService: IGameService + Send + Sync;
    type TPostService: IPostService + Send + Sync;
    type TBlogService: IBlogService + Send + Sync;
    type TCommentService: ICommentService + Send + Sync;
    type TDiscussionService: IDiscussionService + Send + Sync;
    type TSearchService: ISearchService + Send + Sync;
    type TSubscribeService: ISubscribeService + Send + Sync;
    type TVoteService: IVoteService + Send + Sync;
    type TLikeService: ILikeService + Send + Sync;
    type TActivityService: IActivityService + Send + Sync;
}

pub struct InternalServices;
impl IInternalServices for InternalServices {
    type THealthService = HealthService<Database, Cache>;
    type TAuthService = AuthService<Cache>;
    type TUserService = UserService<Database>;
    type TGameService = GameService<Database>;
    type TPostService = PostService<Database>;
    type TBlogService = BlogService<Database>;
    type TCommentService = CommentService<Database>;
    type TDiscussionService = DiscussionService<Database>;
    type TSearchService = SearchService<Database>;
    type TSubscribeService = SubscribeService<Database>;
    type TVoteService = VoteService<Database>;
    type TLikeService = LikeService<Database>;
    type TActivityService = ActivityService<Database>;
}

pub struct Services<TInternalServices: IInternalServices> {
    pub health: RwLock<TInternalServices::THealthService>,
    pub auth: TInternalServices::TAuthService,
    pub user: TInternalServices::TUserService,
    pub game: TInternalServices::TGameService,
    pub post: TInternalServices::TPostService,
    pub blog: TInternalServices::TBlogService,
    pub comment: TInternalServices::TCommentService,
    pub discussion: TInternalServices::TDiscussionService,
    pub search: TInternalServices::TSearchService,
    pub subscribe: TInternalServices::TSubscribeService,
    pub vote: TInternalServices::TVoteService,
    pub like: TInternalServices::TLikeService,
    pub activity: TInternalServices::TActivityService,
}

pub struct ServicesBuilder<TInternalServices: IInternalServices> {
    health: Option<RwLock<TInternalServices::THealthService>>,
    auth: Option<TInternalServices::TAuthService>,
    user: Option<TInternalServices::TUserService>,
    game: Option<TInternalServices::TGameService>,
    post: Option<TInternalServices::TPostService>,
    blog: Option<TInternalServices::TBlogService>,
    comment: Option<TInternalServices::TCommentService>,
    discussion: Option<TInternalServices::TDiscussionService>,
    search: Option<TInternalServices::TSearchService>,
    subscribe: Option<TInternalServices::TSubscribeService>,
    vote: Option<TInternalServices::TVoteService>,
    like: Option<TInternalServices::TLikeService>,
    activity: Option<TInternalServices::TActivityService>,
}

impl<TInternalServices: IInternalServices> ServicesBuilder<TInternalServices> {
    pub fn new() -> Self {
        ServicesBuilder {
            health: None,
            auth: None,
            user: None,
            game: None,
            post: None,
            blog: None,
            comment: None,
            discussion: None,
            search: None,
            subscribe: None,
            vote: None,
            like: None,
            activity: None,
        }
    }

    pub fn health(mut self, health: RwLock<TInternalServices::THealthService>) -> Self {
        self.health = Some(health);
        self
    }

    pub fn auth(mut self, auth: TInternalServices::TAuthService) -> Self {
        self.auth = Some(auth);
        self
    }

    pub fn user(mut self, user: TInternalServices::TUserService) -> Self {
        self.user = Some(user);
        self
    }

    pub fn game(mut self, game: TInternalServices::TGameService) -> Self {
        self.game = Some(game);
        self
    }

    pub fn post(mut self, post: TInternalServices::TPostService) -> Self {
        self.post = Some(post);
        self
    }

    pub fn blog(mut self, blog: TInternalServices::TBlogService) -> Self {
        self.blog = Some(blog);
        self
    }

    pub fn comment(mut self, comment: TInternalServices::TCommentService) -> Self {
        self.comment = Some(comment);
        self
    }

    pub fn discussion(mut self, discussion: TInternalServices::TDiscussionService) -> Self {
        self.discussion = Some(discussion);
        self
    }

    pub fn search(mut self, search: TInternalServices::TSearchService) -> Self {
        self.search = Some(search);
        self
    }

    pub fn subscribe(mut self, subscribe: TInternalServices::TSubscribeService) -> Self {
        self.subscribe = Some(subscribe);
        self
    }

    pub fn vote(mut self, vote: TInternalServices::TVoteService) -> Self {
        self.vote = Some(vote);
        self
    }

    pub fn like(mut self, like: TInternalServices::TLikeService) -> Self {
        self.like = Some(like);
        self
    }

    pub fn activity(mut self, activity: TInternalServices::TActivityService) -> Self {
        self.activity = Some(activity);
        self
    }

    pub fn build(self) -> Services<TInternalServices> {
        Services {
            health: self.health.expect("missing initialization"),
            auth: self.auth.expect("missing initialization"),
            user: self.user.expect("missing initialization"),
            game: self.game.expect("missing initialization"),
            post: self.post.expect("missing initialization"),
            blog: self.blog.expect("missing initialization"),
            comment: self.comment.expect("missing initialization"),
            discussion: self.discussion.expect("missing initialization"),
            search: self.search.expect("missing initialization"),
            subscribe: self.subscribe.expect("missing initialization"),
            vote: self.vote.expect("missing initialization"),
            like: self.like.expect("missing initialization"),
            activity: self.activity.expect("missing initialization"),
        }
    }
}
