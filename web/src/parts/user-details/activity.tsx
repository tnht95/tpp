import { For, Show } from 'solid-js';

import { ActivityCard, LoadingSpinner, ShowMoreButton } from '@/components';
import { useActivitiesCtx } from '@/context';
import { Activity } from '@/models';
import { formatTime } from '@/utils';

const titleMap = {
  user: 'User Joined',
  addedGame: 'Added New Game',
  updatedGame: 'Updated Game',
  post: 'Added New Post'
};

const urlMap = {
  user: 'users',
  addedGame: 'games',
  updatedGame: 'games',
  post: 'posts'
};

const pathMap = {
  user: '',
  addedGame: 'info',
  updatedGame: 'info',
  post: ''
};

const buildUrl = ({ targetType, targetId, userId }: Activity): string => {
  const base = urlMap[targetType];
  const id = targetType === 'user' ? userId : targetId;
  const path = pathMap[targetType];
  return `/${base}/${id}/${path}`;
};

export const UserDetailsActivity = () => {
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
                <ActivityCard
                  url={buildUrl(activity)}
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
