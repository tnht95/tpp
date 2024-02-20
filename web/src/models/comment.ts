export type CommentType = 'blogs' | 'posts' | 'discussions';

export type CommentDetails = {
  id: string;
  userId: number;
  userName: string;
  userAvatar: string;
  content: string;
  likes: number;
  createdAt: string;
};

export type AddComment = {
  targetId: string;
  targetType: CommentType;
  content: string;
};

export type EditComment = AddComment;
