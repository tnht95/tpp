import { useParams } from '@solidjs/router';
import {
  createContext,
  createResource,
  ParentProps,
  Resource,
  useContext
} from 'solid-js';

import { fetchGameByIdAction } from '@/apis';
import { Game } from '@/models';

type GameContext = {
  game: Resource<Game | undefined>;
};

const gameCtx = createContext<GameContext>();

export const GameProvider = (props: ParentProps) => {
  const gameId = useParams()['id'] as string;
  const [game] = createResource(gameId, fetchGameByIdAction);
  const state = {
    game
  };

  return <gameCtx.Provider value={state}>{props.children}</gameCtx.Provider>;
};

export const useGameCtx = () => useContext(gameCtx) as GameContext;
