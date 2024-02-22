export type GameDetails = {
  id: string;
  name: string;
  authorId: number;
  authorName: string;
  authorAvatar: string;
  url: string | undefined;
  avatarUrl: string | undefined;
  about: string | undefined;
  info: string | undefined;
  upVotes: number;
  downVotes: number;
  tags: string[] | undefined;
  rom: string;
  isUpVoted: boolean | undefined;
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
};

export type GameRequest = {
  name: string;
  url: string | undefined;
  avatarUrl: string | undefined;
  about: string | undefined;
  info: string | undefined;
  tags: string[] | undefined;
  memo: string;
};
