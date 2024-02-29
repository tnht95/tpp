import { PAGINATION } from '@/constant';
import { Notification, Response } from '@/models';

import { errHandler } from '.';

export const filterNotificationsAction = async ({
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

export const fetchNotificationCheckAction = async () => {
  const baseUrl = import.meta.env.VITE_API_URL;
  return fetch(`${baseUrl}/notifications/check`, {
    credentials: 'include'
  })
    .then(errHandler)
    .then((r: Response<boolean>) => r.data);
};

export const checkNotificationAction = async () => {
  const baseUrl = import.meta.env.VITE_API_URL;
  return fetch(`${baseUrl}/notifications/check`, {
    method: 'put',
    credentials: 'include'
  })
    .then(errHandler)
    .then((r: Response<boolean>) => r.data);
};

export const readNotificationAction = async (id: number) => {
  const baseUrl = import.meta.env.VITE_API_URL;
  return fetch(`${baseUrl}/notifications/read/${id}`, {
    method: 'put',
    credentials: 'include'
  })
    .then(errHandler)
    .then((r: Response<boolean>) => r.data);
};
