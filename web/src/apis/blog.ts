import { Blog, Response } from '@/models';

import { errHandler } from '.';

export const fetchBlogAction = () =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/blogs`)
    .then(errHandler)
    .then((r: Response<Blog[]>) => r.data);
