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
  fetchDiscussionCountAction,
  filterDiscussionsAction
} from '@/apis';
import { PAGINATION } from '@/constant';
import { DiscussionRequest, DiscussionSummary, RespErr } from '@/models';
import { ModalUtil, useModalUtils } from '@/utils';

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
    loading: () => boolean;
    gameId: string;
  };
  modal: ModalUtil;
};

const ctx = createContext<Ctx>();
export const GameDiscussionsProvider = (props: ParentProps) => {
  const gameId = useParams()['id'] as string;
  const { showToast } = useToastCtx();
  const modal = useModalUtils();
  const [query, setQuery] = createSignal<[number, string]>([0, gameId]);
  const [count, { refetch: reCount }] = createResource(
    gameId,
    fetchDiscussionCountAction
  );
  const [resource] = createResource(query, filterDiscussionsAction, {
    initialValue: []
  });
  const [discussions, setDiscussions] = createStore<DiscussionSummary[]>([]);

  createEffect(() => {
    if (resource().length > 0) {
      setDiscussions(produce(discussions => discussions.push(...resource())));
    }
  });

  const add = (discussion: DiscussionRequest) => {
    addDiscussionAction(discussion, gameId)
      .then(() =>
        batch(() => {
          setDiscussions([]);
          setQuery([0, gameId]);
          reCount() as unknown;
          modal.hide();
          showToast({ msg: 'Discussion Added', type: 'ok' });
        })
      )
      .catch((error: RespErr) => showToast({ msg: error.msg, type: 'err' }));
  };

  const fetchMore = () => {
    setQuery(q => [q[0] + PAGINATION, gameId]);
  };

  const showMore = () => resource().length === PAGINATION;

  const loading = () => discussions.length === 0 && resource.loading;

  const state: Ctx = {
    discussions,
    count,
    dispatch: {
      add,
      fetchMore
    },
    utils: {
      showMore,
      loading,
      gameId
    },
    modal
  };

  return <ctx.Provider value={state}>{props.children}</ctx.Provider>;
};

export const useGameDiscussionsCtx = () => useContext(ctx) as Ctx;
