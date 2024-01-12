import { ParentProps } from 'solid-js/types/render/component';

import { GameDetailsSidebar, GameDetailsTabs } from '@/parts';

export const GameDetails = (props: ParentProps) => (
  <div class="bg-white">
    <GameDetailsTabs />
    <div class="container pb-10 mt-8 ml-10">
      <div class="md:flex">
        <div class=" mr-4 w-9/12">{props.children}</div>
        <GameDetailsSidebar />
      </div>
    </div>
  </div>
);
