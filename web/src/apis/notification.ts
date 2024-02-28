import { PAGINATION } from '@/constant';
import { Notification, Response } from '@/models';

import { errHandler } from '.';

export const filterNotificationssAction = async ({
  offset
}: {
  offset: number;
}) => {
  const baseUrl = import.meta.env.VITE_API_URL;
  return fetch(
    `${baseUrl}/notifications?offset=${offset}&limit=${PAGINATION}`,
    {
      credentials: 'include'
    }
  )
    .then(errHandler)
    .then((r: Response<Notification[]>) => r.data);
};
