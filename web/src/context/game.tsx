import { useParams } from '@solidjs/router';
import {
  createContext,
  createEffect,
  createResource,
  createSignal,
  InitializedResource,
  ParentProps,
  Resource,
  Setter,
  useContext
} from 'solid-js';
import { createStore, produce, SetStoreFunction } from 'solid-js/store';

import {
  fetchDiscussionAction,
  fetchDiscussionCountAction,
  fetchGameByIdAction
} from '@/apis';
import { DiscussionSummary, Game } from '@/models';

type GameContext = {
  game: {
    data: Resource<Game | undefined>;
    refetch: (
      info?: unknown
    ) => Promise<Game | undefined> | Game | undefined | null;
  };
  discussion: {
    data: DiscussionSummary[];
    setDiscussions: SetStoreFunction<DiscussionSummary[]>;
    setParam: Setter<[number, string]>;
    currentDataBatch: InitializedResource<DiscussionSummary[]>;
    reset: () => void;
    count: Resource<number | undefined>;
    recount: (
      info?: unknown
    ) => Promise<number | undefined> | number | undefined | null;
  };
  utils: {
    getGameId: () => string;
  };
};

const gameCtx = createContext<GameContext>();

export const GameProvider = (props: ParentProps) => {
  const gameId = useParams()['id'] as string;
  const [gameData, { refetch }] = createResource(gameId, fetchGameByIdAction);
  const [param, setParam] = createSignal<[number, string]>([0, gameId]);
  const [discussionCount, { refetch: recount }] = createResource(
    gameId,
    fetchDiscussionCountAction
  );
  const [discussionResource] = createResource(
    () => param(),
    fetchDiscussionAction,
    {
      initialValue: []
    }
  );

  const [discussionData, setDiscussions] = createStore<DiscussionSummary[]>([]);

  createEffect(() => {
    if (discussionResource().length > 0) {
      setDiscussions(
        produce(oldValues => oldValues.push(...discussionResource()))
      );
    }
  });

  const resetDiscussion = () => {
    setDiscussions([]);
    setParam([0, gameId]);
  };

  const state: GameContext = {
    game: { data: gameData, refetch: refetch },
    discussion: {
      data: discussionData,
      setDiscussions: setDiscussions,
      setParam: setParam,
      currentDataBatch: discussionResource,
      reset: resetDiscussion,
      count: discussionCount,
      recount: recount
    },
    utils: {
      getGameId: () => gameId
    }
  };

  return <gameCtx.Provider value={state}>{props.children}</gameCtx.Provider>;
};

export const useGameCtx = () => useContext(gameCtx) as GameContext;
