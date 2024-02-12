import { For, Show } from 'solid-js';

import { LoadingSpinner, VerticalGameCard } from '@/components';
import { useNewestGamesCtx } from '@/context';

export const DashboardNewestGames = () => {
  const { newestGames } = useNewestGamesCtx();
  return (
    <Show when={!newestGames.loading} fallback={<LoadingSpinner />}>
      <For each={newestGames()}>{game => <VerticalGameCard game={game} />}</For>
    </Show>
  );
};
