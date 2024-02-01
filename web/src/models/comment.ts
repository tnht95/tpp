export type Comment = {
  id: string;
  userId: number;
  userName: string;
  targetId: string;
  content: string;
  likes: number;
  targetType: 'Blog' | 'Post' | 'Discussion';
  createdAt: string;
  updatedAt: string;
};

export type AddComment = {
  targetId: string;
  targetType: 'Blog' | 'Post' | 'Discussion';
  content: string;
};

export type EditComment = AddComment;
