import { BlogSummary } from './blog';
import { GameSummary } from './game';
import { PostDetails } from './post';
import { UserSummary } from './user';

export type SearchResult = {
  games: GameSummary[];
  users: UserSummary[];
  posts: PostDetails[];
  blogs: BlogSummary[];
};
