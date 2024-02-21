export type ActivityType =
  | 'userJoined'
  | 'addedGame'
  | 'updatedGame'
  | 'addedPost';

export type Activity = {
  userId: number;
  targetType: ActivityType;
  targetId: string;
  memo: string;
  createdAt: string;
};
