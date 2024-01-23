import { AddPost, Post, Response } from '@/models';

export const fetchPostAction = (): Promise<Post[]> =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/posts`)
    .then(r => r.json())
    .then((r: Response<Post[]>) => r.data)
    .catch(() => {}) as Promise<Post[]>;

export const addPostAction = (body: AddPost): Promise<Post> =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/posts`, {
    method: 'post',
    credentials: 'include',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then(r => r.json())
    .then((r: Response<Post>) => r.data)
    .catch(() => {}) as Promise<Post>;
