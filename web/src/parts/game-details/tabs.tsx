import { A } from '@solidjs/router';

import { useGameDetailsCtx } from '@/context';

export const GameDetailsTabs = () => {
  const {
    utils: { gameId }
  } = useGameDetailsCtx();
  return (
    <div class="-mx-10 flex select-none border-b px-10">
      <div class="flex">
        <A
          href={`/games/${gameId}/info`}
          class="px-5"
          activeClass="border-b-2 border-orange-400"
        >
          <div class="flex items-center gap-1 pb-2 text-sm">
            <i class="fa-regular fa-lightbulb" />
            Info
          </div>
        </A>
        <A
          href={`/games/${gameId}/discussion`}
          class="px-5"
          activeClass="border-b-2 border-orange-400"
        >
          <div class="flex items-center gap-1 pb-2 text-sm">
            <i class="fa-regular fa-comment-dots" />
            Discussion
          </div>
        </A>
        <A
          href={`/games/${gameId}/activity`}
          class="px-5"
          activeClass="border-b-2 border-orange-400"
        >
          <div class="flex items-center gap-1 pb-2 text-sm">
            <i class="fa-regular fa-rectangle-list" />
            Activity
          </div>
        </A>
      </div>
    </div>
  );
};
