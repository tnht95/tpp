import { errHandler, QueryWIthTargetInput } from '@/apis';
import {
  AddDiscussion,
  Discussion,
  DiscussionWithUser,
  Response
} from '@/models';

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

export const addDiscussionAction = (body: AddDiscussion) =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/discussions`, {
    method: 'post',
    credentials: 'include',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then(errHandler)
    .then((r: Response<Discussion>) => r.data);

export const fetchDiscussionByIdAction = (id: string) =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/discussions/${id}`)
    .then(errHandler)
    .then((r: Response<DiscussionWithUser | undefined>) => r.data);
