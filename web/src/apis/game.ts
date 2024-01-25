import { Game, Response } from '@/models';

import { errHandler } from '.';

export type GameQueryInput = { [key: string]: string };

export const fetchGameAction = (queryInput?: GameQueryInput) => {
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const query: string[] = [] as const;

  if (queryInput) {
    for (const key in queryInput) {
      query.push(`${key}=${queryInput[key]}`);
    }
  }
  return fetch(`${baseUrl}/games?${query.join('&')}`)
    .then(errHandler)
    .then((r: Response<Game[]>) => r.data);
};
