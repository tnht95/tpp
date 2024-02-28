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

import {
  deleteDiscussionAction,
  editDiscussionAction,
  fetchDiscussionByIdAction
} from '@/apis';
import { LoadingSpinner } from '@/components';
import { DiscussionDetails, DiscussionRequest, RespErr } from '@/models';
import { NotFound } from '@/pages';
import { ModalUtil, useModalUtils } from '@/utils';

import { useToastCtx } from './toast';

type Ctx = {
  discussion: () => DiscussionDetails;
  dispatch: {
    edit: (discussion: DiscussionRequest) => void;
    del: (discussionId: string) => void;
  };
  utils: {
    discussionId: () => string;
  };
  modal: ModalUtil;
};

const ctx = createContext<Ctx>();
export const GameDiscussionDetailsProvider = (props: ParentProps) => {
  const [gameId, setGameId] = createSignal(useParams()['id'] as string);
  const [discussionId, setDiscussionId] = createSignal(
    useParams()['discussionId'] as string
  );
  const [query] = createSignal<[string, string]>([gameId(), discussionId()]);
  const navigate = useNavigate();
  const { showToast } = useToastCtx();
  const modal = useModalUtils();
  const [resource, { mutate }] = createResource(
    query,
    fetchDiscussionByIdAction
  );

  createEffect(() => {
    setGameId(useParams()['id'] as string);
  });
  createEffect(() => {
    setDiscussionId(useParams()['discussionId'] as string);
  });

  const edit = (discussion: DiscussionRequest) => {
    editDiscussionAction(gameId(), discussionId(), discussion)
      .then(discussion =>
        batch(() => {
          mutate(discussion);
          modal.hide();
          showToast({ msg: 'Discussion Updated', type: 'ok' });
        })
      )
      .catch((error: RespErr) => showToast({ msg: error.msg, type: 'err' }));
  };

  const handleBatchDelete = () =>
    batch(() => {
      navigate(`/games/${gameId()}/discussions`);
      showToast({ msg: 'Discussion Deleted', type: 'ok' });
    });

  const del = () => {
    deleteDiscussionAction(gameId(), discussionId())
      .then(handleBatchDelete)
      .catch((error: RespErr) => showToast({ msg: error.msg, type: 'err' }));
  };

  const state = {
    discussion: () => resource() as DiscussionDetails,
    dispatch: {
      edit,
      del
    },
    utils: { discussionId },
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

export const useGameDiscussionDetailsCtx = () => useContext(ctx) as Ctx;
