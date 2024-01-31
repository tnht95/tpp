export enum TargetTypes {
  Blog,
  Discussion,
  Post
}

export type Comment = {
  id: number;
  userId: string;
  userName: string;
  targetId: string;
  content: string;
  likes: number;
  targetType: TargetTypes;
  createdAt: string;
  updatedAt: string;
};

export const cmt: Comment = {
  content: '',
  createdAt: '',
  id: 0,
  likes: 0,
  targetId: '',
  targetType: TargetTypes.Blog,
  updatedAt: '',
  userId: '',
  userName: ''
};
