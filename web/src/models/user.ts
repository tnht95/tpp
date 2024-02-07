export type User = {
  id: number;
  name: string;
  githubUrl: string;
  bio: string | undefined;
  avatar: string;
  createdAt: string;
  updatedAt: string;
};

export type UserSummary = {
  id: number;
  name: string;
  avatar: string;
};
