import { For, Show } from 'solid-js';

import { Avatar, EllipsisText, Tag } from '@/components';
import { useGameDetailsCtx } from '@/context';

export const GameDetailsSidebar = () => {
  const { game } = useGameDetailsCtx();
  return (
    <div class="w-1/4">
      <div class="block">
        <p class="text-base font-semibold text-black">About</p>
        <div class="mt-4 border-b pb-2">
          <span class="text-sm lg:text-base">{game().about}</span>
          <Show when={game().url}>
            <div class="my-4">
              <a
                class="mb-2 flex items-center text-base font-semibold text-blue-600 hover:text-blue-400"
                href={game().url as string}
                target="_blank"
              >
                <i class="fa-solid fa-link mr-2" />
                <EllipsisText maxWidth="w-90">
                  {game().url as string}
                </EllipsisText>
              </a>
            </div>
          </Show>
        </div>
      </div>
      <div class="border-b py-6">
        <p class="mb-5 text-base font-semibold text-black">Upload By</p>
        <Avatar userId={game().authorId} />
      </div>
      <div class="my-4 flex flex-col flex-wrap gap-2 border-b pb-5">
        <p class="mb-3 text-base font-semibold text-black">Tag</p>
        <Show when={game().tags}>
          <div class="flex flex-wrap gap-2">
            <For each={game().tags}>{tag => <Tag name={tag} />}</For>
          </div>
        </Show>
      </div>
      <div class="mt-3 flex gap-3">
        <button
          type="button"
          class="mt-2 rounded-lg border border-green-600 bg-green-600 p-2.5 text-sm font-medium text-white hover:bg-white hover:text-green-600 focus:outline-none focus:ring-4 focus:ring-purple-300"
        >
          <i class="fa-solid fa-gamepad mr-2" />
          Play!
        </button>
        <a
          href={`${import.meta.env.VITE_SERVER_URL}/${game().rom}`}
          target="_blank"
          type="button"
          class="mt-2 rounded-lg border border-purple-700 bg-purple-700 p-2.5 text-sm font-medium text-white hover:bg-white hover:text-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300"
        >
          <i class="fa-solid fa-download mr-2" />
          Download!
        </a>
      </div>
    </div>
  );
};
