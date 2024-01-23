export interface Game {
  id: string;
  name: string;
  author_id: number;
  url: string | null;
  avatar_url: string | null;
  about: string | null;
  info: string | null;
  stars: number;
  tags: string[] | null;
  rom: string;
  created_at: Date;
  updated_at: Date;
}
