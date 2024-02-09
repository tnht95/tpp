import { RespErr, Response, SearchResult } from '@/models';

import { errHandler } from '.';

export type SearchQueryInput = {
  keyword: string;
  category: string | undefined;
  limit: number;
  offset: number;
};

export const searchAction = async (queryInput: SearchQueryInput) => {
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const query: string[] = [] as const;

  for (const key in queryInput) {
    if (queryInput[key as keyof SearchQueryInput]) {
      query.push(`${key}=${queryInput[key as keyof SearchQueryInput]}`);
    }
  }

  return fetch(`${baseUrl}/search?${query.join('&')}`)
    .then(errHandler)
    .then((r: Response<SearchResult>) => r.data)
    .catch((error: RespErr) => {
      throw error.msg;
    });
};
