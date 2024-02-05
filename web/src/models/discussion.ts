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

export type DiscussionSummary = {
  id: string;
  userName: string;
  title: string;
  createdAt: string;
};

export type AddDiscussion = {
  gameId: string;
  title: string;
  content: string;
};

export type DiscussionWithUser = {
  id: string;
  userId: number;
  userName: string;
  userAvatar: string;
  gameId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};
