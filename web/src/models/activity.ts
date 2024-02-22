export type ActivityType = 'user' | 'addedGame' | 'updatedGame' | 'post';

export type Activity = {
  userId: number;
  targetType: ActivityType;
  targetId: string;
  memo: string;
  createdAt: string;
};
