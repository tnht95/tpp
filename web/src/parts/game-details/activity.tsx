import { For, Show } from 'solid-js';

import { Activity, LoadingSpinner, ShowMoreButton } from '@/components';
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
  addedGame: 'Added new game',
  updatedGame: 'Updated game',
  addedPost: 'should not be here'
};

const GameDetailsActivityInner = () => {
  const { game } = useGameDetailsCtx();
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
            <Activity
              url={`/games/${game().id}/info`}
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
