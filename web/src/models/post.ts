export type PostDetails = {
  id: string;
  userId: number;
  userName: string;
  userAvatar: string;
  content: string;
  likes: number;
  isLiked: boolean | undefined;
  comments: number;
  createdAt: string;
};

export type AddPost = {
  content: string;
};

export type EditPost = AddPost;
