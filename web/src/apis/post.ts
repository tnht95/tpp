import { PAGINATION } from '@/constant';
import { AddPost, EditPost, PostDetails, Response } from '@/models';

import { errHandler } from '.';

export const filterPostsAction = async ({ offset }: { offset: number }) => {
  const baseUrl = import.meta.env.VITE_API_URL;
  return fetch(`${baseUrl}/posts?offset=${offset}&limit=${PAGINATION}`, {
    credentials: 'include'
  })
    .then(errHandler)
    .then((r: Response<PostDetails[]>) => r.data);
};

export const addPostAction = (body: AddPost) =>
  fetch(`${import.meta.env.VITE_API_URL}/posts`, {
    method: 'post',
    credentials: 'include',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then(errHandler)
    .then((r: Response<undefined>) => r.data);

export const deletePostAction = (id: string) =>
  fetch(`${import.meta.env.VITE_API_URL}/posts/${id}`, {
    method: 'delete',
    credentials: 'include'
  })
    .then(errHandler)
    .then((r: Response<undefined>) => r.data);

export const editPostAction = (id: string, body: EditPost) =>
  fetch(`${import.meta.env.VITE_API_URL}/posts/${id}`, {
    method: 'put',
    credentials: 'include',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then(errHandler)
    .then((r: Response<PostDetails>) => r.data);
