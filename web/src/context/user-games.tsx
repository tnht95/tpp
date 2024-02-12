import { useParams } from '@solidjs/router';
import {
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

import { addGameAction, filterGameAction, GameQueryInput } from '@/apis';
import { LoadingSpinner } from '@/components';
import { GameRequest, GameSummary, RespErr } from '@/models';
import { ModalUtil, useModalUtils } from '@/utils';

import { useToastCtx } from './toast';

const PAGINATION_INTERNAL = 9;

type Ctx = {
  games: GameSummary[];
  dispatch: {
    add: (file: File, game: GameRequest) => void;
    fetchMore: () => void;
  };
  utils: {
    showMore: () => boolean;
    userId: number;
  };
  modal: ModalUtil;
};

const ctx = createContext<Ctx>();
export const UserGamesProvider = (props: ParentProps) => {
  const userId = Number.parseInt(useParams()['id'] as string);
  const { showToast } = useToastCtx();
  const modal = useModalUtils();
  const [param, setParam] = createSignal<GameQueryInput>({
    authorId: userId,
    orderBy: 'desc',
    orderField: 'createdAt',
    offset: 0,
    limit: PAGINATION_INTERNAL
  });
  const [resource] = createResource(param, filterGameAction, {
    initialValue: []
  });
  const [games, setGames] = createStore<GameSummary[]>([]);

  createEffect(() => {
    if (resource().length > 0) {
      setGames(produce(games => games.push(...resource())));
    }
  });

  const add = (file: File, game: GameRequest) => {
    addGameAction(file, game)
      .then(() =>
        batch(() => {
          setGames([]);
          setParam(p => ({ ...p, offset: 0 }));
          modal.hide();
          showToast({ msg: 'Game Added', type: 'Ok' });
        })
      )
      .catch((error: RespErr) => showToast({ msg: error.msg, type: 'Err' }));
  };

  const fetchMore = () => {
    setParam(p => ({
      ...p,
      offset: (p.offset as number) + PAGINATION_INTERNAL
    }));
  };

  const showMore = () => resource().length === PAGINATION_INTERNAL;

  const state: Ctx = {
    games,
    dispatch: {
      add,
      fetchMore
    },
    utils: {
      showMore,
      userId
    },
    modal
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

export const useUserGamesCtx = () => useContext(ctx) as Ctx;
