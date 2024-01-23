import { User } from '@/models';

// TODO: handle error
export const fetchUserAction = () =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/me`, { credentials: 'include' })
    .then(r => r.json())
    .catch(() => {}) as Promise<User>;

export const logoutAction = () =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/logout`, {
    method: 'post',
    credentials: 'include'
  });
