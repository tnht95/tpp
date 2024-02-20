export type LikeType = 'comments' | 'posts' | 'discussions';

export type AddLike = {
  targetId: string;
  targetType: LikeType;
};

export type DeleteLike = AddLike;
