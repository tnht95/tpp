use book::{BookService, IBookService};
use health::{HealthService, IHealthService};
use user::{IUserService, UserService};

use crate::database::Database;

pub mod book;
pub mod health;
pub mod user;

pub trait IInternalServices {
    type THealthService: IHealthService + Send + Sync;
    type TBookService: IBookService + Send + Sync;
    type TUserService: IUserService + Send + Sync;
}

pub struct InternalServices;
impl IInternalServices for InternalServices {
    type THealthService = HealthService<Database>;
    type TBookService = BookService<Database>;
    type TUserService = UserService<Database>;
}
