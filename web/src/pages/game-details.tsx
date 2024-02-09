import { ErrorBoundary, Suspense } from 'solid-js';
import { ParentProps } from 'solid-js/types/render/component';

import { LoadingSpinner } from '@/components';
import { GameProvider } from '@/context';
import { NotFound } from '@/pages';
import {
  GameDetailsHeader,
  GameDetailsSidebar,
  GameDetailsTabs
} from '@/parts';

const GameDetailsWrapper = (props: ParentProps) => (
  <Suspense
    fallback={
      <div class="flex h-svh items-center justify-center">
        <LoadingSpinner />
      </div>
    }
  >
    <ErrorBoundary fallback={<NotFound />}>
      <div class="flex flex-col gap-5 px-10 py-8">
        <GameDetailsHeader />
        <GameDetailsTabs />
        <div class="flex justify-between pt-4">
          <div class="w-4/6">{props.children}</div>
          <GameDetailsSidebar />
        </div>
      </div>
    </ErrorBoundary>
  </Suspense>
);

export const GameDetails = (props: ParentProps) => (
  <GameProvider>
    <GameDetailsWrapper>{props.children}</GameDetailsWrapper>
  </GameProvider>
);
