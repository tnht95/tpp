import { useParams } from '@solidjs/router';
import {
  createContext,
  createResource,
  createSignal,
  InitializedResource,
  ParentProps,
  Resource,
  Setter,
  useContext
} from 'solid-js';
import { createStore, SetStoreFunction } from 'solid-js/store';

import {
  fetchDiscussionAction,
  fetchGameByIdAction,
  QueryWIthTargetInput
} from '@/apis';
import { LIMIT } from '@/constant';
import { Discussion, Game } from '@/models';

type GameContext = {
  game: {
    data: Resource<Game | undefined>;
  };
  discussion: {
    data: Discussion[];
    setDiscussions: SetStoreFunction<Discussion[]>;
    setQueryValue: Setter<QueryWIthTargetInput>;
    currentDataBatch: InitializedResource<Discussion[]>;
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

  const [discussions, setDiscussions] = createStore<Discussion[]>([]);

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
