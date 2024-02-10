import { errHandler } from '@/apis';
import { PAGINATION } from '@/constant';
import {
  DiscussionDetails,
  DiscussionRequest,
  DiscussionSummary,
  Response
} from '@/models';

export const fetchDiscussionAction = async ([offset, gameId]: [
  number,
  string
]) => {
  const baseUrl = import.meta.env.VITE_SERVER_URL;

  return fetch(
    `${baseUrl}/games/${gameId}/discussions?offset=${offset}&limit=${PAGINATION}`
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
    .then((r: Response<undefined>) => r.data);

export const fetchDiscussionByIdAction = ([gameId, id]: [string, string]) =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/games/${gameId}/discussions/${id}`)
    .then(errHandler)
    .then((r: Response<DiscussionDetails | undefined>) => r.data);

export const editDiscussionAction = (
  gameId: string,
  id: string,
  body: DiscussionRequest
) =>
  fetch(
    `${import.meta.env.VITE_SERVER_URL}/games/${gameId}/discussions/${id}`,
    {
      method: 'put',
      credentials: 'include',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(body)
    }
  )
    .then(errHandler)
    .then((r: Response<DiscussionDetails>) => r.data);

export const deleteDiscussionAction = (gameId: string, id: string) =>
  fetch(
    `${import.meta.env.VITE_SERVER_URL}/games/${gameId}/discussions/${id}`,
    {
      method: 'delete',
      credentials: 'include'
    }
  )
    .then(errHandler)
    .then((r: Response<undefined>) => r.data);

export const fetchDiscussionCountAction = (gameId: string) =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/games/${gameId}/discussions/counts`)
    .then(errHandler)
    .then((r: Response<number>) => r.data);
