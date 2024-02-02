import { errHandler, QueryWIthTargetInput } from '@/apis';
import { Discussion, Response } from '@/models';

export const fetchDiscussionAction = (queryInput: QueryWIthTargetInput) => {
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const query: string[] = [] as const;

  for (const key in queryInput) {
    query.push(`${key}=${queryInput[key as keyof QueryWIthTargetInput]}`);
  }

  return fetch(`${baseUrl}/discussions?${query.join('&')}`)
    .then(errHandler)
    .then((r: Response<Discussion[]>) => r.data);
};
