export type GameSummary = {
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

export type Game = {
  id: string;
  name: string;
  authorName: string;
  avatarUrl: string;
  stars: number;
  tags: string[] | null;
  createdAt: string;
};
