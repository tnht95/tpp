import { ParentProps } from 'solid-js/types/render/component';

import {
  GameDetailsHeader,
  GameDetailsSidebar,
  GameDetailsTabs
} from '@/parts';

export const GameDetails = (props: ParentProps) => (
  <div class="flex flex-col gap-5 px-10 py-8">
    <GameDetailsHeader />
    <GameDetailsTabs />
    <div class="flex justify-between pt-4">
      <div class="w-4/6">{props.children}</div>
      <GameDetailsSidebar />
    </div>
  </div>
);
