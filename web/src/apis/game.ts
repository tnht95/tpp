import { LIMIT } from '@/constant';
import { GameSummary, Response } from '@/models';

import { errHandler } from '.';

export type OrderField = 'createdAt' | 'stars' | 'name';
export type OrderBy = 'asc' | 'desc';

export type GameQueryInput = {
  authorId?: number;
  orderField?: OrderField;
  orderBy?: OrderBy;
  limit?: number;
  offset?: number;
  tag?: string;
};

export const fetchGameAction = (queryInput: GameQueryInput) => {
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const query: string[] = [] as const;

  if (queryInput.offset == undefined) {
    query.push('offset=0');
  }

  if (!queryInput.limit) {
    query.push(`limit=${LIMIT}`);
  }

  for (const key in queryInput) {
    if (queryInput[key as keyof GameQueryInput]) {
      query.push(`${key}=${queryInput[key as keyof GameQueryInput]}`);
    }
  }

  return fetch(`${baseUrl}/games?${query.join('&')}`)
    .then(errHandler)
    .then((r: Response<GameSummary[]>) => r.data);
};
