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
  fetchDiscussionAction,
  fetchDiscussionCountAction,
  fetchGameByIdAction
} from '@/apis';
import { PAGINATION } from '@/constant';
import { DiscussionSummary, Game } from '@/models';

type GameContext = {
  gameDetails: {
    data: Resource<Game | undefined>;
    dispatch: {
      refetch: () => void;
    };
  };
  discussions: {
    data: DiscussionSummary[];
    dispatch: {
      refetch: () => void;
      count: Resource<number | undefined>;
      fetchMore: () => void;
    };
    utils: {
      showMore: () => boolean;
    };
  };
  utils: {
    getGameId: () => string;
  };
};

const gameCtx = createContext<GameContext>();

export const GameProvider = (props: ParentProps) => {
  const gameId = useParams()['id'] as string;
  const [gameData, { refetch: refetchGameData }] = createResource(
    gameId,
    fetchGameByIdAction
  );

  const [discussionParams, setDiscussionParams] = createSignal<
    [number, string]
  >([0, gameId]);
  const [discussionCount, { refetch: reFetchDiscussionCount }] = createResource(
    gameId,
    fetchDiscussionCountAction
  );
  const [discussionResource] = createResource(
    () => discussionParams(),
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

  const state: GameContext = {
    gameDetails: {
      data: gameData,
      dispatch: {
        refetch: () => {
          refetchGameData() as unknown;
        }
      }
    },
    discussions: {
      data: discussionData,
      dispatch: {
        refetch: () => {
          batch(() => {
            setDiscussions([]);
            setDiscussionParams([0, gameId]);
            reFetchDiscussionCount() as unknown;
          });
        },
        count: discussionCount,
        fetchMore: () => {
          setDiscussionParams(oldValue => [oldValue[0] + PAGINATION, gameId]);
        }
      },
      utils: {
        showMore: () => discussionResource().length === PAGINATION
      }
    },
    utils: {
      getGameId: () => gameId
    }
  };

  return <gameCtx.Provider value={state}>{props.children}</gameCtx.Provider>;
};

export const useGameCtx = () => useContext(gameCtx) as GameContext;
