import { useParams } from '@solidjs/router';
import {
  batch,
  createContext,
  createEffect,
  createResource,
  createSignal,
  ParentProps,
  Resource,
  Show,
  useContext
} from 'solid-js';
import { createStore, produce } from 'solid-js/store';

import {
  addDiscussionAction,
  fetchDiscussionCountAction,
  filterDiscussionsAction
} from '@/apis';
import { LoadingSpinner } from '@/components';
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
    gameId: string;
  };
  modal: ModalUtil;
};

const ctx = createContext<Ctx>();
export const GameDiscussionsProvider = (props: ParentProps) => {
  const gameId = useParams()['id'] as string;
  const { showToast } = useToastCtx();
  const modal = useModalUtils();
  const [params, setParams] = createSignal<[number, string]>([0, gameId]);
  const [count, { refetch: reCount }] = createResource(
    gameId,
    fetchDiscussionCountAction
  );
  const [resource] = createResource(params, filterDiscussionsAction, {
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
          setParams([0, gameId]);
          reCount() as unknown;
          modal.hide();
          showToast({ msg: 'Discussion Added', type: 'Ok' });
        })
      )
      .catch((error: RespErr) => showToast({ msg: error.msg, type: 'Err' }));
  };

  const fetchMore = () => {
    setParams(params => [params[0] + PAGINATION, gameId]);
  };

  const showMore = () => resource().length === PAGINATION;

  const state: Ctx = {
    discussions,
    count,
    dispatch: {
      add,
      fetchMore
    },
    utils: {
      showMore,
      gameId
    },
    modal
  };

  return (
    <ctx.Provider value={state}>
      <Show
        when={discussions.length > 0 || (!resource.loading && !count.loading)}
        fallback={<LoadingSpinner />}
      >
        {props.children}
      </Show>
    </ctx.Provider>
  );
};

export const useGameDiscussionsCtx = () => useContext(ctx) as Ctx;
