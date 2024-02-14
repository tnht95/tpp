import { errHandler } from '@/apis';
import { Response, VoteRequest } from '@/models';

export const voteAction = (gameId: string, body: VoteRequest) =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/games/${gameId}/votes`, {
    method: 'post',
    credentials: 'include',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then(errHandler)
    .then((r: Response<undefined>) => r.data);

export const unVoteAction = (gameId: string) =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/games/${gameId}/votes`, {
    method: 'delete',
    credentials: 'include'
  })
    .then(errHandler)
    .then((r: Response<undefined>) => r.data);
