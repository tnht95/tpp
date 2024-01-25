import { Blog, Response } from '@/models';

export const fetchBlogAction = () =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/blogs`)
    .then(r => r.json())
    .then((r: Response<Blog[]>) => r.data);
