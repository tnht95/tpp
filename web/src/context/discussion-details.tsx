import { useNavigate, useParams } from '@solidjs/router';
import {
  batch,
  createContext,
  createResource,
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
import { ModalUtil, useModal } from '@/utils';

import { useToastCtx } from './toast';

type Ctx = {
  discussion: Resource<DiscussionDetails | undefined>;
  dispatch: {
    edit: (discussion: DiscussionRequest) => void;
    del: (discussionId: string) => void;
  };
  modal: ModalUtil;
};

const ctx = createContext<Ctx>();
export const DiscussionDetailsProvider = (props: ParentProps) => {
  const gameId = useParams()['id'] as string;
  const discussionId = useParams()['discussionId'] as string;
  const navigate = useNavigate();
  const {
    dispatch: { showToast }
  } = useToastCtx();
  const modal = useModal();
  const [discussion, { refetch }] = createResource(
    discussionId,
    fetchDiscussionByIdAction
  );

  const edit = (discussion: DiscussionRequest) => {
    editDiscussionAction(discussionId, discussion)
      .then(() =>
        batch(() => {
          modal.hide();
          showToast({ msg: 'Discussion Updated', type: 'Ok' });
          refetch() as unknown;
        })
      )
      .catch((error: RespErr) => showToast({ msg: error.msg, type: 'Err' }));
  };

  const del = () => {
    deleteDiscussionAction(discussionId)
      .then(() =>
        batch(() => {
          navigate(`/games/${gameId}/discussion`);
          showToast({ msg: 'Discussion Deleted', type: 'Ok' });
        })
      )
      .catch((error: RespErr) => showToast({ msg: error.msg, type: 'Err' }));
  };

  const state = {
    discussion,
    dispatch: {
      edit,
      del
    },
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

export const useDiscussionDetailsCtx = () => useContext(ctx) as Ctx;
