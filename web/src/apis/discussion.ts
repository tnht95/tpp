import { errHandler } from '@/apis';
import { LIMIT } from '@/constant';
import {
  Discussion,
  DiscussionRequest,
  DiscussionSummary,
  DiscussionWithUser,
  Response
} from '@/models';

export const fetchDiscussionAction = async ([offset, gameId]: [
  number,
  string
]) => {
  const baseUrl = import.meta.env.VITE_SERVER_URL;

  return fetch(
    `${baseUrl}/games/${gameId}/discussions?offset=${offset}&limit=${LIMIT}`
  )
    .then(errHandler)
    .then((r: Response<DiscussionSummary[]>) => r.data);
};

export const addDiscussionAction = (body: DiscussionRequest, gameId: string) =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/games/${gameId}/discussions`, {
    method: 'post',
    credentials: 'include',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then(errHandler)
    .then((r: Response<Discussion>) => r.data);

export const fetchDiscussionByIdAction = (id: string) =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/discussions/${id}`)
    .then(errHandler)
    .then((r: Response<DiscussionWithUser | undefined>) => r.data);

export const editDiscussionAction = (id: string, body: DiscussionRequest) =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/discussions/${id}`, {
    method: 'put',
    credentials: 'include',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then(errHandler)
    .then((r: Response<Discussion>) => r.data);

export const deleteDiscussionAction = (id: string) =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/discussions/${id}`, {
    method: 'delete',
    credentials: 'include'
  })
    .then(errHandler)
    .then((r: Response<Discussion>) => r.data);
