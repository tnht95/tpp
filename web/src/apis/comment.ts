import { AddComment, Comment, EditComment, Response } from '@/models';

import { errHandler, QueryWIthTargetInput } from '.';

export const fetchCommentAction = (queryInput: QueryWIthTargetInput) => {
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const query: string[] = [] as const;

  for (const key in queryInput) {
    query.push(`${key}=${queryInput[key as keyof QueryWIthTargetInput]}`);
  }

  return fetch(`${baseUrl}/comments?${query.join('&')}`)
    .then(errHandler)
    .then((r: Response<Comment[]>) => r.data);
};

export const addCommentAction = (body: AddComment) =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/comments`, {
    method: 'post',
    credentials: 'include',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then(errHandler)
    .then((r: Response<Comment>) => r.data);

export const deleteCommentAction = (id: string) =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/comments/${id}`, {
    method: 'delete',
    credentials: 'include'
  })
    .then(errHandler)
    .then((r: Response<Comment>) => r.data);

export const editCommentAction = (id: string, body: EditComment) =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/comments/${id}`, {
    method: 'put',
    credentials: 'include',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then(errHandler)
    .then((r: Response<Comment>) => r.data);
