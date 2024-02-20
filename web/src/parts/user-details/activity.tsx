import { For, Show } from 'solid-js';

import { Activity, LoadingSpinner, ShowMoreButton } from '@/components';
import { useActivitiesCtx } from '@/context';
import { formatTime } from '@/utils';

const titleMap = {
  addedGame: 'Added new game',
  updatedGame: 'Updated game',
  addedPost: 'Added new post'
};

const urlMap = {
  addedGame: 'games',
  updatedGame: 'games',
  addedPost: 'posts'
};

export const UserActivity = () => {
  const {
    activities,
    dispatch: { fetchMore },
    utils: { showMore, loading }
  } = useActivitiesCtx();
  return (
    <div class="rounded-xl border bg-white px-8 pb-10 pt-3">
      <div class="mb-5 items-center space-x-2 font-semibold leading-8 text-gray-900">
        <i class="fa-regular fa-newspaper text-lg text-green-400" />
        <span class="tracking-wide">Activity</span>
      </div>
      <Show when={!loading()} fallback={<LoadingSpinner />}>
        <Show when={activities.length > 0} fallback={nothingToShow}>
          <ol class="relative start-2 border-s border-gray-200">
            <For each={activities}>
              {activity => (
                <Activity
                  url={`/${urlMap[activity.targetType]}/${activity.targetId}/info`}
                  title={titleMap[activity.targetType]}
                  date={formatTime(activity.createdAt)}
                  info={activity.memo}
                />
              )}
            </For>
          </ol>
          <Show when={showMore()}>
            <ShowMoreButton
              vertical
              onClick={fetchMore}
              customStyle="border-none py-3"
            />
          </Show>
        </Show>
      </Show>
    </div>
  );
};

const nothingToShow = (
  <div class="flex w-full justify-center p-7 text-gray-300">
    <div>--- Nothing to show ---</div>
  </div>
);
