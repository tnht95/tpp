import { useParams } from '@solidjs/router';
import {
  batch,
  createContext,
  createEffect,
  createResource,
  createSignal,
  ParentProps,
  Resource,
  useContext
} from 'solid-js';
import { createStore, produce } from 'solid-js/store';

import {
  addDiscussionAction,
  fetchDiscussionAction,
  fetchDiscussionCountAction
} from '@/apis';
import { PAGINATION } from '@/constant';
import { DiscussionRequest, DiscussionSummary, RespErr } from '@/models';
import { ModalUtil, useModal } from '@/utils';

import { useToastCtx } from './toast';

type Ctx = {
  discussions: DiscussionSummary[];
  count: Resource<number>;
  dispatch: {
    add: (discussion: DiscussionRequest) => void;
    fetchMore: () => void;
  };
  utils: {
    showMore: () => boolean;
    gameId: string;
  };
  modal: ModalUtil;
};

const ctx = createContext<Ctx>();
export const DiscussionProvider = (props: ParentProps) => {
  const gameId = useParams()['id'] as string;
  const {
    dispatch: { showToast }
  } = useToastCtx();
  const modal = useModal();
  const [params, setParams] = createSignal<[number, string]>([0, gameId]);
  const [count, { refetch }] = createResource(
    gameId,
    fetchDiscussionCountAction
  );
  const [discussionResource] = createResource(params, fetchDiscussionAction, {
    initialValue: []
  });
  const [discussions, setDiscussions] = createStore<DiscussionSummary[]>([]);

  createEffect(() => {
    if (discussionResource().length > 0) {
      setDiscussions(
        produce(oldValues => oldValues.push(...discussionResource()))
      );
    }
  });

  const reset = () =>
    batch(() => {
      setDiscussions([]);
      setParams([0, gameId]);
      refetch() as unknown;
    });

  const add = (discussion: DiscussionRequest) => {
    addDiscussionAction(discussion, gameId)
      .then(reset)
      .then(modal.hide)
      .then(() => showToast({ msg: 'Discussion Added', type: 'Ok' }))
      .catch((error: RespErr) => showToast({ msg: error.msg, type: 'Err' }));
  };

  const fetchMore = () => {
    setParams(params => [params[0] + PAGINATION, gameId]);
  };

  const state: Ctx = {
    discussions,
    count,
    dispatch: {
      add,
      fetchMore
    },
    utils: {
      showMore: () => discussionResource().length === PAGINATION,
      gameId
    },
    modal
  };

  return <ctx.Provider value={state}>{props.children}</ctx.Provider>;
};

export const useDiscussionCtx = () => useContext(ctx) as Ctx;
