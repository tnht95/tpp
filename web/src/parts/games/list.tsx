import { For, Show } from 'solid-js';

import { OrderBy, OrderField } from '@/apis';
import { GameCard, LoadingSpinner, ShowMoreButton } from '@/components';
import { useGamesCtx } from '@/context';

export const GameList = () => {
  const {
    games,
    dispatch: { fetchWith, fetchMore },
    utils: { showMore, loading }
  } = useGamesCtx();
  return (
    <div class="flex w-4/5 flex-col gap-10">
      <div class="flex flex-row items-center gap-7">
        <p class="text-2xl font-bold text-indigo-900">All Games</p>
        <div class="flex items-center">
          <select
            onChange={e =>
              fetchWith(...(e.target.value.split('-') as [OrderField, OrderBy]))
            }
            class="block rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="" disabled selected>
              Sort by
            </option>
            <option value="createdAt-desc">Date</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="votes-desc">Votes</option>
          </select>
        </div>
      </div>
      <Show when={!loading()} fallback={<LoadingSpinner />}>
        <div class="flex flex-row flex-wrap gap-7">
          <For each={games}>{game => <GameCard game={game} />}</For>
          <Show when={showMore()}>
            <ShowMoreButton onClick={fetchMore} />
          </Show>
        </div>
      </Show>
    </div>
  );
};
