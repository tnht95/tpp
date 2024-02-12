import {
  createContext,
  createResource,
  ParentProps,
  Resource,
  Show,
  useContext
} from 'solid-js';

import { filterGameAction } from '@/apis';
import { LoadingSpinner } from '@/components';
import { GameSummary } from '@/models';

type Ctx = {
  newestGames: Resource<GameSummary[]>;
};

const ctx = createContext<Ctx>();
export const NewestGamesProvider = (props: ParentProps) => {
  const [newestGames] = createResource(
    { orderField: 'createdAt', orderBy: 'desc', limit: 5 },
    filterGameAction
  );
  return (
    <ctx.Provider value={{ newestGames }}>
      <Show when={!newestGames.loading} fallback={<LoadingSpinner />}>
        {props.children}
      </Show>
    </ctx.Provider>
  );
};

export const useNewestGamesCtx = () => useContext(ctx) as Ctx;
