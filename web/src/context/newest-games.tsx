import {
  createContext,
  createResource,
  ParentProps,
  Resource,
  useContext
} from 'solid-js';

import { filterGamesAction } from '@/apis';
import { GameSummary } from '@/models';

type Ctx = {
  newestGames: Resource<GameSummary[]>;
};

const ctx = createContext<Ctx>();
export const NewestGamesProvider = (props: ParentProps) => {
  const [newestGames] = createResource(
    { orderField: 'createdAt', orderBy: 'desc', limit: 5 },
    filterGamesAction
  );
  return <ctx.Provider value={{ newestGames }}>{props.children}</ctx.Provider>;
};

export const useNewestGamesCtx = () => useContext(ctx) as Ctx;
