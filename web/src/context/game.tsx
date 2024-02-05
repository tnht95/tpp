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
  fetchGameByIdAction,
  QueryWIthTargetInput
} from '@/apis';
import { LIMIT } from '@/constant';
import { DiscussionSummary, Game } from '@/models';

type GameContext = {
  game: {
    data: Resource<Game | undefined>;
  };
  discussion: {
    data: DiscussionSummary[];
    setDiscussions: SetStoreFunction<DiscussionSummary[]>;
    setQueryValue: Setter<QueryWIthTargetInput>;
    currentDataBatch: InitializedResource<DiscussionSummary[]>;
  };
  utils: {
    getGameId: () => string;
  };
};

const gameCtx = createContext<GameContext>();

export const GameProvider = (props: ParentProps) => {
  const gameId = useParams()['id'] as string;
  const [game] = createResource(gameId, fetchGameByIdAction);
  const [queryValue, setQueryValue] = createSignal<QueryWIthTargetInput>({
    targetId: gameId,
    offset: 0,
    limit: LIMIT
  });

  const [discussionResource] = createResource(
    queryValue,
    fetchDiscussionAction,
    {
      initialValue: []
    }
  );

  const [discussions, setDiscussions] = createStore<DiscussionSummary[]>([]);

  createEffect(() => {
    if (discussionResource().length > 0) {
      setDiscussions(
        produce(oldValues => oldValues.push(...discussionResource()))
      );
    }
  });

  const state: GameContext = {
    game: { data: game },
    discussion: {
      data: discussions,
      setDiscussions: setDiscussions,
      setQueryValue: setQueryValue,
      currentDataBatch: discussionResource
    },
    utils: {
      getGameId: () => gameId
    }
  };

  return <gameCtx.Provider value={state}>{props.children}</gameCtx.Provider>;
};

export const useGameCtx = () => useContext(gameCtx) as GameContext;
