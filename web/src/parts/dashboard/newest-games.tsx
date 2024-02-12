import { For } from 'solid-js';

import { VerticalGameCard } from '@/components';
import { useNewestGamesCtx } from '@/context';

export const DashboardNewestGames = () => {
  const { newestGames } = useNewestGamesCtx();
  return (
    <For each={newestGames()}>{game => <VerticalGameCard game={game} />}</For>
  );
};
