import { LIMIT } from '@/constant';
import { AddBlog, Blog, BlogSummary, Response } from '@/models';

import { errHandler } from '.';

export const fetchBlogAction = (offset: number) =>
  fetch(
    `${
      import.meta.env.VITE_SERVER_URL
    }/blogs?orderBy=desc&offset=${offset}&limit=${LIMIT}`
  )
    .then(errHandler)
    .then((r: Response<BlogSummary[]>) => r.data);

export const addBlogAction = (body: AddBlog) =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/blogs`, {
    method: 'post',
    credentials: 'include',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then(errHandler)
    .then((r: Response<Blog>) => r.data);

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
    .then((r: Response<Blog>) => r.data);
