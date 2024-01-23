export type Game = {
  id: string;
  name: string;
  author_id: number;
  author_name: string;
  url: string | null;
  avatar_url: string;
  about: string | null;
  info: string | null;
  stars: number;
  tags: string[] | null;
  rom: string;
  created_at: Date;
  updated_at: Date;
};
