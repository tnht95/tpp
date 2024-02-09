export type Game = {
  id: string;
  name: string;
  authorId: number;
  authorName: string;
  url: string | undefined;
  avatarUrl: string | undefined;
  about: string | undefined;
  info: string | undefined;
  upVotes: number;
  downVotes: number;
  subscribes: number;
  is_subscribed: boolean;
  tags: string[] | undefined;
  rom: string;
  createdAt: string;
  updatedAt: string;
};

export type GameSummary = {
  id: string;
  name: string;
  authorId: number;
  authorName: string;
  avatarUrl: string | undefined;
  upVotes: number;
  downVotes: number;
  tags: string[] | undefined;
  createdAt: string;
};

export type GameRequest = {
  name: string;
  url: string | undefined;
  avatarUrl: string | undefined;
  about: string | undefined;
  info: string | undefined;
  tags: string[] | undefined;
};
