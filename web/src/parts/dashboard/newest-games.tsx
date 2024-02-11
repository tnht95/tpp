import { createResource, For, Show } from 'solid-js';

import { fetchGameAction } from '@/apis';
import { LoadingSpinner, VerticalGameCard } from '@/components';

export const NewestGames = () => {
  const [newestGames] = createResource(
    { orderField: 'createdAt', orderBy: 'desc', limit: 5 },
    fetchGameAction
  );
  return (
    <nav class="flex-2">
      <div class="fixed flex-col overflow-hidden px-10">
        <p class="mt-7 p-4 text-xl font-bold text-indigo-900">Newest games</p>
        <div class="flex flex-col gap-5">
          <Show when={!newestGames.loading} fallback={<LoadingSpinner />}>
            <For each={newestGames()}>
              {game => <VerticalGameCard game={game} />}
            </For>
          </Show>
        </div>
      </div>
    </nav>
  );
};
