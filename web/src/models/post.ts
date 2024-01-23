export interface Post {
  id: string; // Assuming Uuid is represented as a string
  author_id: number;
  content: string;
  likes: number;
  comments: number;
  created_at: Date;
  updated_at: Date;
}