import {
  Accessor,
  batch,
  createContext,
  createEffect,
  createResource,
  createSignal,
  ParentProps,
  Show,
  useContext
} from 'solid-js';
import { createStore, produce } from 'solid-js/store';

import { filterGameAction, GameQueryInput, OrderBy, OrderField } from '@/apis';
import { LoadingSpinner } from '@/components';
import { PAGINATION } from '@/constant';
import { GameSummary } from '@/models';

type Ctx = {
  games: GameSummary[];
  dispatch: {
    fetchWith: (opts: string) => void;
    fetchMore: () => void;
  };
  utils: {
    optionValues: string[];
    selectedValue: Accessor<number>;
    showMore: () => void;
  };
};

const optionValues = ['createdAt-desc', 'name-asc', 'name-desc', 'votes-desc'];

const ctx = createContext<Ctx>();
export const GamesProvider = (props: ParentProps) => {
  const [selectedValue, setSelectedValue] = createSignal(-1);
  const [query, setQuery] = createSignal<GameQueryInput>({
    offset: 0,
    limit: PAGINATION
  });
  const [resource] = createResource(query, filterGameAction, {
    initialValue: []
  });
  const [games, setGames] = createStore<GameSummary[]>([]);

  createEffect(() => {
    if (resource().length > 0) {
      setGames(produce(games => games.push(...resource())));
    }
  });

  const fetchWith = (value: string) =>
    batch(() => {
      setSelectedValue(optionValues.indexOf(value));
      setGames([]);
      const v = value.split('-') as [OrderField, OrderBy];
      setQuery({
        orderField: v[0],
        orderBy: v[1],
        offset: 0,
        limit: PAGINATION
      });
    });

  const fetchMore = () =>
    batch(() => {
      setQuery(q => ({ ...q, offset: (q.offset as number) + PAGINATION }));
    });

  const showMore = () => resource().length === PAGINATION;

  const state: Ctx = {
    games,
    dispatch: {
      fetchWith,
      fetchMore
    },
    utils: {
      optionValues,
      selectedValue,
      showMore
    }
  };

  return (
    <ctx.Provider value={state}>
      <Show
        when={games.length > 0 || !resource.loading}
        fallback={<LoadingSpinner />}
      >
        {props.children}
      </Show>
    </ctx.Provider>
  );
};

export const useGamesCtx = () => useContext(ctx) as Ctx;
