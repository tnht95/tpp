import { ParentProps } from 'solid-js/types/render/component';

import { GameDetailsSidebar, GameDetailsTabs } from '@/parts';

export const GameDetails = (props: ParentProps) => (
  <div class="bg-white">
    <GameDetailsTabs />
    <div class="ml-10 mt-8 pb-10">
      <div class="md:flex">
        <div class="mr-4 w-4/6">{props.children}</div>
        <GameDetailsSidebar />
      </div>
    </div>
  </div>
);
