import { Response, User } from '@/models';

import { errHandler } from '.';

export const fetchUserAction = () =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/me`, {
    credentials: 'include'
  })
    .then(errHandler)
    .then((r: Response<User>) => r.data)
    .catch(() => {}) as Promise<User | undefined>; // empty body

export const logoutAction = () =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/logout`, {
    method: 'post',
    credentials: 'include'
  }).then(errHandler);
