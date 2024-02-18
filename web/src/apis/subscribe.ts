import { errHandler } from '@/apis';
import { Response } from '@/models';

export const subscribeAction = (userId: string) =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/users/${userId}/subscribes`, {
    method: 'post',
    credentials: 'include',
    headers: {
      'content-type': 'application/json'
    }
  })
    .then(errHandler)
    .then((r: Response<undefined>) => r.data);

export const unSubscribeAction = (userId: string) =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/users/${userId}/subscribes`, {
    method: 'delete',
    credentials: 'include'
  })
    .then(errHandler)
    .then((r: Response<undefined>) => r.data);
