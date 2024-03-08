import { useNavigate, useParams } from '@solidjs/router';
import {
  batch,
  createContext,
  createEffect,
  createResource,
  createSignal,
  ErrorBoundary,
  ParentProps,
  Show,
  useContext
} from 'solid-js';

import { deleteGameAction, editGameAction, fetchGameByIdAction } from '@/apis';
import { LoadingSpinner } from '@/components';
import { GameDetails, GameRequest } from '@/models';
import { NotFound } from '@/pages';
import { authenticationStore } from '@/store';
import { ModalUtil, useModalUtils } from '@/utils';

import { useToastCtx } from './toast';

type Ctx = {
  game: () => GameDetails;
  dispatch: {
    edit: (file: File, game: GameRequest) => void;
    del: (gameId: string) => void;
  };
  utils: {
    gameId: () => string;
  };
  modal: ModalUtil;
};

const ctx = createContext<Ctx>();
export const GameDetailsProvider = (props: ParentProps) => {
  const [gameId, setGameId] = createSignal(useParams()['id'] as string);
  const [resource, { mutate }] = createResource(gameId, fetchGameByIdAction);
  const { showToast } = useToastCtx();
  const modal = useModalUtils();
  const navigate = useNavigate();
  const { user } = authenticationStore;

  createEffect(() => {
    setGameId(useParams()['id'] as string);
  });

  const edit = (file: File, game: GameRequest) => {
    editGameAction(file, game, gameId())
      .then(game =>
        batch(() => {
          mutate(game);
          modal.hide();
          navigate(`/games/${game.id}/info`);
          showToast({ message: 'Game Updated', type: 'ok' });
        })
      )
      .catch(({ message }: Error) => showToast({ message, type: 'err' }));
  };

  const del = () => {
    deleteGameAction(gameId())
      .then(() =>
        batch(() => {
          navigate(`/users/${user()?.id}`);
          showToast({ message: 'Game Deleted', type: 'ok' });
        })
      )
      .catch(({ message }: Error) => showToast({ message, type: 'err' }));
  };

  const state: Ctx = {
    game: () => resource() as GameDetails,
    dispatch: {
      edit,
      del
    },
    utils: {
      gameId
    },
    modal
  };

  return (
    <ctx.Provider value={state}>
      <Show when={!resource.loading} fallback={<LoadingSpinner />}>
        <ErrorBoundary fallback={<NotFound />}>{props.children}</ErrorBoundary>
      </Show>
    </ctx.Provider>
  );
};

export const useGameDetailsCtx = () => useContext(ctx) as Ctx;
