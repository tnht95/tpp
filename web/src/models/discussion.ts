export type Discussion = {
  id: string;
  userId: number;
  userName: string;
  gameId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type AddDiscussion = {
  gameId: string;
  title: string;
  content: string;
};
