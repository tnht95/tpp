import { For, Show } from 'solid-js';

import { ActivityCard, LoadingSpinner, ShowMoreButton } from '@/components';
import {
  ActivitiesProvider,
  useActivitiesCtx,
  useGameDetailsCtx
} from '@/context';
import { formatTime } from '@/utils';

export const GameDetailsActivity = () => {
  const { game } = useGameDetailsCtx();
  return (
    <ActivitiesProvider userId={game().authorId} targetId={game().id}>
      <GameDetailsActivityInner />
    </ActivitiesProvider>
  );
};

const titleMap = {
  user: 'should not be here',
  addedGame: 'Added New Game',
  updatedGame: 'Updated Game',
  post: 'should not be here'
};

const GameDetailsActivityInner = () => {
  const {
    activities,
    dispatch: { fetchMore },
    utils: { showMore, loading }
  } = useActivitiesCtx();
  return (
    <Show when={!loading()} fallback={<LoadingSpinner />}>
      <ol class="relative border-s border-gray-200">
        <For each={activities}>
          {activity => (
            <ActivityCard
              url={`/games/${activity.targetId}/info`}
              title={titleMap[activity.targetType]}
              date={formatTime(activity.createdAt)}
              info={activity.memo}
            />
          )}
        </For>
      </ol>
      <Show when={showMore()}>
        <ShowMoreButton vertical onClick={fetchMore} />
      </Show>
    </Show>
  );
};
