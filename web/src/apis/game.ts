import { Game, Response } from '@/models';

export const fetchNewestGameAction = (): Promise<Game[]> =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/newest_games`)
    .then(r => r.json())
    .then((r: Response<Game[]>) => r.data)
    .catch(() => {}) as Promise<Game[]>;

export const fetchGameAction = (): Promise<Game[]> =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/games`)
    .then(r => r.json())
    .then((r: Response<Game[]>) => r.data)
    .catch(() => {}) as Promise<Game[]>;
