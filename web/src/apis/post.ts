import { LIMIT } from '@/constant';
import { AddPost, Post, Response } from '@/models';

export const fetchPostAction = (offset: number) => {
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  return fetch(`${baseUrl}/posts?orderBy=desc&offset=${offset}&limit=${LIMIT}`)
    .then(r => r.json())
    .then((r: Response<Post[]>) => r.data);
};

export const addPostAction = (body: AddPost) =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/posts`, {
    method: 'post',
    credentials: 'include',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then(r => r.json())
    .then((r: Response<Post>) => r.data);
