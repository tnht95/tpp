export type TargetType = 'blog' | 'post' | 'discussion';

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
  targetType: TargetType;
  content: string;
};

export type EditComment = AddComment;
