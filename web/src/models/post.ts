export type Post = {
  id: string;
  authorId: number;
  content: string;
  likes: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
};

export type AddPost = {
  content: string;
};
