import { LIMIT } from '@/constant';
import { Blog, BlogRequest, BlogSummary, Response } from '@/models';

import { errHandler } from '.';

export const fetchBlogAction = (offset: number) =>
  fetch(
    `${import.meta.env.VITE_SERVER_URL}/blogs?offset=${offset}&limit=${LIMIT}`
  )
    .then(errHandler)
    .then((r: Response<BlogSummary[]>) => r.data);

export const addBlogAction = (body: BlogRequest) =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/blogs`, {
    method: 'post',
    credentials: 'include',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then(errHandler)
    .then((r: Response<undefined>) => r.data);

export const fetchBlogByIdAction = (id: string) =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/blogs/${id}`)
    .then(errHandler)
    .then((r: Response<Blog | undefined>) => r.data);

export const deleteBlogAction = (id: string) =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/blogs/${id}`, {
    method: 'delete',
    credentials: 'include'
  })
    .then(errHandler)
    .then((r: Response<undefined>) => r.data);

export const editBlogAction = (id: string, body: BlogRequest) =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/blogs/${id}`, {
    method: 'put',
    credentials: 'include',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then(errHandler)
    .then((r: Response<undefined>) => r.data);

export const fetchBlogTagsAction = () =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/blogs/tags`)
    .then(errHandler)
    .then((r: Response<string[]>) => r.data);
