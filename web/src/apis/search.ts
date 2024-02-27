import { RespErr, Response, SearchResult, TagSearchResult } from '@/models';

import { errHandler } from '.';

export type SearchQueryInput = {
  keyword: string;
  category: string | undefined;
  limit: number;
  offset: number;
};

export type TagSearchQueryInput = {
  category: string | undefined;
  limit: number;
  offset: number;
};

export const searchAction = async (queryInput: SearchQueryInput) => {
  const baseUrl = import.meta.env.VITE_API_URL;
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

export const tagSearchAction = async ([tag, queryInput]: [
  string,
  TagSearchQueryInput
]) => {
  const baseUrl = import.meta.env.VITE_API_URL;
  const query: string[] = [] as const;

  for (const key in queryInput) {
    if (queryInput[key as keyof TagSearchQueryInput]) {
      query.push(`${key}=${queryInput[key as keyof TagSearchQueryInput]}`);
    }
  }

  return fetch(`${baseUrl}/tags/${tag}?${query.join('&')}`)
    .then(errHandler)
    .then((r: Response<TagSearchResult>) => r.data)
    .catch((error: RespErr) => {
      throw error.msg;
    });
};
