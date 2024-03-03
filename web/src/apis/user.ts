import { Auth, Response, UserDetails } from '@/models';

import { errHandler } from '.';

export const fetchMeAction = () =>
  fetch(`${import.meta.env.VITE_API_URL}/me`, {
    credentials: 'include'
  })
    .then(errHandler)
    .then((r: Response<Auth>) => r.data)
    .catch(() => {}) as Promise<Auth | undefined>; // empty body

export const logoutAction = () =>
  fetch(`${import.meta.env.VITE_API_URL}/logout`, {
    method: 'delete',
    credentials: 'include'
  }).then(errHandler);

export const fetchUserByIdAction = (id: string) =>
  fetch(`${import.meta.env.VITE_API_URL}/users/${id}`, {
    credentials: 'include'
  })
    .then(errHandler)
    .then((r: Response<UserDetails | undefined>) => r.data);

export const fetchUserIdByNameAction = (name: string) =>
  fetch(`${import.meta.env.VITE_API_URL}/users/name/${name}`)
    .then(errHandler)
    .then((r: Response<number | undefined>) => r.data);
