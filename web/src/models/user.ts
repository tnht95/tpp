export interface User {
  id: number;
  name: string;
  github_url: string;
  bio: string | null;
  avatar: string;
  created_at: Date;
  updated_at: Date;
}
