import { Show, Suspense } from 'solid-js';
import { ParentProps } from 'solid-js/types/render/component';

import { LoadingSpinner } from '@/components';
import { GameProvider, useGameCtx } from '@/context';
import { NotFound } from '@/pages';
import { GameDetailsSidebar, GameDetailsTabs } from '@/parts';

const Game = (props: ParentProps) => {
  const { game } = useGameCtx();

  return (
    <Suspense
      fallback={
        <div class="flex h-svh items-center justify-center">
          <LoadingSpinner />
        </div>
      }
    >
      <Show when={game()} fallback={<NotFound />}>
        <div class="bg-white">
          <GameDetailsTabs />
          <div class="ml-10 mt-8 pb-10">
            <div class="md:flex">
              <div class="mr-4 w-4/6">{props.children}</div>
              <GameDetailsSidebar />
            </div>
          </div>
        </div>
      </Show>
    </Suspense>
  );
};

export const GameDetails = (props: ParentProps) => (
  <GameProvider>
    <Game>{props.children}</Game>
  </GameProvider>
);
