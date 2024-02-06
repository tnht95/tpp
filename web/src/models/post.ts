export type PostDetails = {
  id: string;
  authorId: number;
  authorName: string;
  authorAvatar: string;
  content: string;
  likes: number;
  comments: number;
  createdAt: string;
};

export type PostContent = {
  id: string;
  content: string;
};

export type AddPost = {
  content: string;
};

export type EditPost = AddPost;
