import { A } from '@solidjs/router';

import { useGameCtx } from '@/context';

export const GameDetailsTabs = () => {
  const {
    gameDetails: { data }
  } = useGameCtx();
  return (
    <div class="-mx-10 flex select-none border-b px-10">
      <div class="flex">
        <A
          href={`/games/${data()?.id}/info`}
          class="px-5"
          activeClass="border-b-2 border-orange-400"
        >
          <div class="flex items-center gap-1 pb-2 text-sm">
            <i class="fa-regular fa-lightbulb" />
            Info
          </div>
        </A>
        <A
          href={`/games/${data()?.id}/discussion`}
          class="px-5"
          activeClass="border-b-2 border-orange-400"
        >
          <div class="flex items-center gap-1 pb-2 text-sm">
            <i class="fa-regular fa-comment-dots" />
            Discussion
          </div>
        </A>
      </div>
    </div>
  );
};
