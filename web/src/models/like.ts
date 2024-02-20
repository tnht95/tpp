export type LikeTargetType = 'comments' | 'posts' | 'discussions';

export type AddLike = {
  targetId: string;
  targetType: LikeTargetType;
};

export type DeleteLike = AddLike;
