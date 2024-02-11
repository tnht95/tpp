import { useNavigate, useParams } from '@solidjs/router';
import {
  Accessor,
  batch,
  createContext,
  createResource,
  createSignal,
  ErrorBoundary,
  ParentProps,
  Resource,
  Show,
  useContext
} from 'solid-js';

import { deleteGameAction, editGameAction, fetchGameByIdAction } from '@/apis';
import { LoadingSpinner } from '@/components';
import { Game, GameRequest, RespErr } from '@/models';
import { NotFound } from '@/pages';
import { authenticationStore } from '@/store';
import { ModalUtil, useModal } from '@/utils';

import { useToastCtx } from './toast';

type Ctx = {
  game: Resource<Game | undefined>;
  dispatch: {
    edit: (file: File, game: GameRequest) => void;
    del: (gameId: string) => void;
  };
  utils: {
    gameId: string;
    isEditMode: Accessor<boolean>;
  };
  modal: ModalUtil;
};

const ctx = createContext<Ctx>();
export const GameDetailsProvider = (props: ParentProps) => {
  const gameId = useParams()['id'] as string;
  const [game] = createResource(gameId, fetchGameByIdAction);
  const [isEditMode, setIsEditMode] = createSignal(false);
  const { showToast } = useToastCtx();
  const modal = useModal({
    onHide: () => {
      setIsEditMode(false);
    },
    onShow: () => {
      setIsEditMode(true);
    }
  });
  const navigate = useNavigate();
  const { user } = authenticationStore;

  const edit = (file: File, game: GameRequest) => {
    editGameAction(file, game, gameId)
      .then(() =>
        batch(() => {
          modal.hide();
          showToast({ msg: 'Game Updated', type: 'Ok' });
          setIsEditMode(false);
        })
      )
      .catch((error: RespErr) => showToast({ msg: error.msg, type: 'Err' }));
  };

  const del = () => {
    deleteGameAction(gameId)
      .then(() => {
        navigate(`/users/${user()?.id}`);
        return showToast({ msg: 'Game Deleted', type: 'Ok' });
      })
      .catch((error: RespErr) => showToast({ msg: error.msg, type: 'Err' }));
  };

  const state: Ctx = {
    game,
    dispatch: {
      edit,
      del
    },
    utils: {
      gameId,
      isEditMode
    },
    modal
  };

  return (
    <ctx.Provider value={state}>
      <Show when={!game.loading} fallback={<LoadingSpinner />}>
        <ErrorBoundary fallback={<NotFound />}>{props.children}</ErrorBoundary>
      </Show>
    </ctx.Provider>
  );
};

export const useGameDetailsCtx = () => useContext(ctx) as Ctx;
