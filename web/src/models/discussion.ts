export type DiscussionSummary = {
  id: string;
  userName: string;
  title: string;
  createdAt: string;
};

export type DiscussionRequest = {
  title: string;
  content: string;
};

export type DiscussionDetails = {
  id: string;
  userId: number;
  userName: string;
  userAvatar: string;
  gameId: string;
  title: string;
  content: string;
  createdAt: string;
};
