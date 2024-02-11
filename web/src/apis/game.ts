import { GameDetails, GameRequest, GameSummary, Response } from '@/models';

import { errHandler } from '.';

export type OrderField = 'createdAt' | 'stars' | 'name';
export type OrderBy = 'asc' | 'desc';

export type GameQueryInput = {
  authorId?: number;
  orderField?: OrderField;
  orderBy?: OrderBy;
  limit?: number;
  offset?: number;
  tag?: string;
};

export const fetchGameAction = async (queryInput: GameQueryInput) => {
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const query: string[] = [] as const;

  for (const key in queryInput) {
    query.push(`${key}=${queryInput[key as keyof GameQueryInput]}`);
  }

  return fetch(`${baseUrl}/games?${query.join('&')}`)
    .then(errHandler)
    .then((r: Response<GameSummary[]>) => r.data);
};

export const fetchGameByIdAction = (id: string) =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/games/${id}`, {
    credentials: 'include'
  })
    .then(errHandler)
    .then((r: Response<GameDetails | undefined>) => r.data);

export const deleteGameAction = (id: string) =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/games/${id}`, {
    method: 'delete',
    credentials: 'include'
  })
    .then(errHandler)
    .then((r: Response<undefined>) => r.data);

export const addGameAction = async (rom: File, game: GameRequest) => {
  const formData = new FormData();
  formData.append('rom', rom);
  formData.append('game', JSON.stringify(game));

  return fetch(`${import.meta.env.VITE_SERVER_URL}/games`, {
    method: 'post',
    credentials: 'include',
    body: formData
  })
    .then(errHandler)
    .then((r: Response<undefined>) => r.data);
};

export const editGameAction = async (
  rom: File,
  game: GameRequest,
  gameId: string
) => {
  const formData = new FormData();
  formData.append('rom', rom);
  formData.append('game', JSON.stringify(game));

  return fetch(`${import.meta.env.VITE_SERVER_URL}/games/${gameId}`, {
    method: 'put',
    credentials: 'include',
    body: formData
  })
    .then(errHandler)
    .then((r: Response<GameDetails>) => r.data);
};

export const fetchGameTagsAction = () =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/games/tags`)
    .then(errHandler)
    .then((r: Response<string[]>) => r.data);
