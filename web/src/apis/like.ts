import { errHandler } from '@/apis';
import { AddLike, DeleteLike, Response } from '@/models';

export const likeAction = (body: AddLike) =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/likes`, {
    method: 'post',
    credentials: 'include',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then(errHandler)
    .then((r: Response<undefined>) => r.data);

export const unLikeAction = (body: DeleteLike) =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/likes`, {
    method: 'delete',
    credentials: 'include',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then(errHandler)
    .then((r: Response<undefined>) => r.data);
