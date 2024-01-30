import { Auth, Response, User } from '@/models';

import { errHandler } from '.';

export const fetchUserAction = () =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/me`, {
    credentials: 'include'
  })
    .then(errHandler)
    .then((r: Response<Auth>) => r.data)
    .catch(() => {}) as Promise<Auth | undefined>; // empty body

export const logoutAction = () =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/logout`, {
    method: 'post',
    credentials: 'include'
  }).then(errHandler);

export const fetchUserByIdAction = (id: string) =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/users/${id}`)
    .then(errHandler)
    .then((r: Response<User | undefined>) => r.data);
