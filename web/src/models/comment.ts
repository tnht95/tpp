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

export const cmt: Comment = {
  content: '',
  createdAt: '',
  id: '',
  likes: 0,
  targetId: '',
  targetType: 'Blog',
  updatedAt: '',
  userId: 1,
  userName: ''
};
