import { Response, User } from '@/models';

export const fetchUserAction = (): Promise<User> =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/me`, {
    credentials: 'include'
  })
    .then(r => r.json())
    .then((r: Response<User>) => r.data)
    .catch(() => {}) as Promise<User>;

export const logoutAction = () =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/logout`, {
    method: 'post',
    credentials: 'include'
  });
