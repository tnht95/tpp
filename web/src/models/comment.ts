export type CommentType = 'blogs' | 'posts' | 'discussions';

export type CommentDetails = {
  id: string;
  userId: number;
  userName: string;
  userAvatar: string;
  content: string;
  likes: number;
  isLiked: boolean | undefined;
  createdAt: string;
};

export type AddComment = {
  targetId: string;
  targetType: CommentType;
  content: string;
};

export type EditComment = AddComment;

export type DeleteComment = {
  targetId: string;
  targetType: CommentType;
};
