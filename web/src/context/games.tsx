import {
  batch,
  createContext,
  createEffect,
  createResource,
  createSignal,
  ParentProps,
  useContext
} from 'solid-js';
import { createStore, produce } from 'solid-js/store';

import { filterGamesAction, GameQueryInput, OrderBy, OrderField } from '@/apis';
import { PAGINATION } from '@/constant';
import { GameSummary } from '@/models';

type Ctx = {
  games: GameSummary[];
  dispatch: {
    fetchWith: (orderField: OrderField, orderBy: OrderBy) => void;
    fetchMore: () => void;
  };
  utils: {
    showMore: () => void;
    loading: () => boolean;
  };
};

const ctx = createContext<Ctx>();
export const GamesProvider = (props: ParentProps) => {
  const [query, setQuery] = createSignal<GameQueryInput>({
    orderField: 'createdAt',
    orderBy: 'asc',
    offset: 0,
    limit: PAGINATION
  });
  const [resource] = createResource(query, filterGamesAction, {
    initialValue: []
  });
  const [games, setGames] = createStore<GameSummary[]>([]);

  createEffect(() => {
    if (resource().length > 0) {
      setGames(produce(games => games.push(...resource())));
    }
  });

  const fetchWith = (orderField: OrderField, orderBy: OrderBy) =>
    batch(() => {
      setGames([]);
      setQuery({
        orderField,
        orderBy,
        offset: 0,
        limit: PAGINATION
      });
    });

  const fetchMore = () => {
    setQuery(q => ({ ...q, offset: (q.offset as number) + PAGINATION }));
  };

  const showMore = () => resource().length === PAGINATION;

  const loading = () => games.length === 0 && resource.loading;

  const state: Ctx = {
    games,
    dispatch: {
      fetchWith,
      fetchMore
    },
    utils: {
      showMore,
      loading
    }
  };

  return <ctx.Provider value={state}>{props.children}</ctx.Provider>;
};

export const useGamesCtx = () => useContext(ctx) as Ctx;
