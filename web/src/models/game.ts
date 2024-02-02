export type Game = {
  id: string;
  name: string;
  authorId: number;
  authorName: string;
  url: string | null;
  avatarUrl: string;
  about: string | null;
  info: string | null;
  stars: number;
  tags: string[] | null;
  rom: string;
  createdAt: string;
  updatedAt: string;
};

export type GameSummary = {
  id: string;
  name: string;
  authorId: number;
  authorName: string;
  avatarUrl: string;
  stars: number;
  tags: string[] | null;
  createdAt: string;
};

export type AddGame = {
  name: string;
  url: string | undefined;
  avatarUrl: string | undefined;
  about: string | undefined;
  info: string | undefined;
  tags: string[] | undefined;
};
