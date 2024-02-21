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
  comments: number;
  likes: number;
  isLiked: boolean | undefined;
  content: string;
  createdAt: string;
};
