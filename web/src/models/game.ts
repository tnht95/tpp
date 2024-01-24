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
