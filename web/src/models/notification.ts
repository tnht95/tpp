export type NotificationType =
  | 'likePost'
  | 'likeDiscussion'
  | 'likeCommentBlog'
  | 'likeCommentPost'
  | 'likeCommentDiscussion'
  | 'commentBlog'
  | 'commentPost'
  | 'commentDiscussion'
  | 'commentTagBlog'
  | 'commentTagPost'
  | 'commentTagDiscussion'
  | 'subscribe'
  | 'userAddedGame'
  | 'userUpdatedGame'
  | 'userPost'
  | 'voteGame';

export type Notification = {
  id: string;
  toUserId: number;
  byUserId: number;
  byUserName: string;
  byUserNameAvatar: string;
  byObjectId: string;
  targetType: NotificationType;
  targetId: string;
  parentTargetId: string;
  isRead: boolean;
  createdAt: string;
};
