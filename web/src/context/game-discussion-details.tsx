import { useNavigate, useParams } from '@solidjs/router';
import {
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
  discussion: Resource<DiscussionDetails | undefined>;
  dispatch: {
    edit: (discussion: DiscussionRequest) => void;
    del: (discussionId: string) => void;
  };
  utils: {
    discussionId: string;
  };
  modal: ModalUtil;
};

const ctx = createContext<Ctx>();
export const GameDiscussionDetailsProvider = (props: ParentProps) => {
  const gameId = useParams()['id'] as string;
  const discussionId = useParams()['discussionId'] as string;
  const [params] = createSignal<[string, string]>([gameId, discussionId]);
  const navigate = useNavigate();
  const { showToast } = useToastCtx();
  const modal = useModalUtils();
  const [discussion, { mutate }] = createResource(
    params,
    fetchDiscussionByIdAction
  );

  const edit = (discussion: DiscussionRequest) => {
    editDiscussionAction(gameId, discussionId, discussion)
      .then(discussion =>
        batch(() => {
          modal.hide();
          mutate(discussion);
          showToast({ msg: 'Discussion Updated', type: 'ok' });
        })
      )
      .catch((error: RespErr) => showToast({ msg: error.msg, type: 'err' }));
  };

  const del = () => {
    deleteDiscussionAction(gameId, discussionId)
      .then(() =>
        batch(() => {
          navigate(`/games/${gameId}/discussion`);
          showToast({ msg: 'Discussion Deleted', type: 'ok' });
        })
      )
      .catch((error: RespErr) => showToast({ msg: error.msg, type: 'err' }));
  };

  const state = {
    discussion,
    dispatch: {
      edit,
      del
    },
    utils: { discussionId },
    modal
  };

  return (
    <ctx.Provider value={state}>
      <Show when={!discussion.loading} fallback={<LoadingSpinner />}>
        <ErrorBoundary fallback={<NotFound />}>{props.children}</ErrorBoundary>
      </Show>
    </ctx.Provider>
  );
};

export const useGameDiscussionDetailsCtx = () => useContext(ctx) as Ctx;
