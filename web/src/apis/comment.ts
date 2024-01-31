import { errHandler } from '@/apis';
import { Comment, Response } from '@/models';

export type CommentQueryInput = {
  targetId: string;
  limit?: number;
  offset?: number;
};
export const fetchCommentAction = (queryInput: CommentQueryInput) => {
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const query: string[] = [] as const;

  for (const key in queryInput) {
    query.push(`${key}=${queryInput[key as keyof CommentQueryInput]}`);
  }

  return fetch(`${baseUrl}/comments?${query.join('&')}`)
    .then(errHandler)
    .then((r: Response<Comment[]>) => r.data);
};
