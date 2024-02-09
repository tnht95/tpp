import { useParams } from '@solidjs/router';
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

import { editDiscussionAction, fetchDiscussionByIdAction } from '@/apis';
import { LoadingSpinner } from '@/components';
import { DiscussionDetails, DiscussionRequest, RespErr } from '@/models';
import { NotFound } from '@/pages';
import { ModalUtil, useModal } from '@/utils';

import { useToastCtx } from './toast';

type Ctx = {
  discussion: Resource<DiscussionDetails | undefined>;
  dispatch: {
    edit: (discussion: DiscussionRequest) => void;
  };
  utils: {
    gameId: string;
    isEditMode: Accessor<boolean>;
  };
  modal: ModalUtil;
};

const ctx = createContext<Ctx>();
export const DiscussionDetailsProvider = (props: ParentProps) => {
  const gameId = useParams()['id'] as string;
  const discussionId = useParams()['discussionId'] as string;
  const { dispatch } = useToastCtx();
  const [isEditMode, setIsEditMode] = createSignal(false);
  const modal = useModal({
    onHide: () => {
      setIsEditMode(false);
    },
    onShow: () => {
      setIsEditMode(true);
    }
  });
  const [discussion, { refetch }] = createResource(
    discussionId,
    fetchDiscussionByIdAction
  );

  const state = {
    discussion,
    dispatch: {
      edit: (discussion: DiscussionRequest) =>
        editDiscussionAction(discussionId, discussion)
          .then(() =>
            batch(() => {
              modal.hide();
              dispatch.showToast({ msg: 'Discussion Updated', type: 'Ok' });
              return refetch();
            })
          )
          .catch((error: RespErr) =>
            dispatch.showToast({ msg: error.msg, type: 'Err' })
          )
    },
    utils: {
      gameId,
      isEditMode
    },
    modal
  };

  return (
    <ctx.Provider value={state}>
      <Show
        when={!discussion.loading}
        fallback={
          <div class="flex h-svh items-center justify-center">
            <LoadingSpinner />
          </div>
        }
      >
        <ErrorBoundary fallback={<NotFound />}>{props.children}</ErrorBoundary>
      </Show>
    </ctx.Provider>
  );
};

export const useDiscussionDetailsCtx = () => useContext(ctx) as Ctx;
