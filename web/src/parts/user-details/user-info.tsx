import { Show } from 'solid-js';

import { PillButton } from '@/components';
import { useUserDetailsCtx } from '@/context';
import { authenticationStore } from '@/store';

export const UserInfo = () => {
  const {
    utils: { isSameUser }
  } = authenticationStore;
  const {
    user,
    utils: { userId }
  } = useUserDetailsCtx();
  return (
    <div class="rounded-xl border bg-white py-6">
      <div class="flex justify-center">
        <img
          src={user()?.avatar as string}
          class="absolute -m-16 max-w-[150px] rounded-full border-8 border-white"
          alt="d"
        />
      </div>
      <div class="mt-20 flex justify-center">
        <h3 class="text-2xl font-bold leading-normal text-gray-700">
          {user()?.name}
        </h3>
      </div>
      <div class="mt-2 flex flex-col items-center">
        <div class="text-sm text-gray-500">
          <i class="fa-solid fa-link mr-2" />
          <a href={user()?.githubUrl ?? ''} target="_blank">
            {user()?.githubUrl}
          </a>
        </div>
        <Show when={user()?.bio}>
          <div>{user()?.bio}</div>
        </Show>
      </div>
      <div class="mt-6 border-t border-gray-200 pt-6">
        <div class="flex justify-center">
          <PillButton
            title="Subscribe"
            icon="fa-solid fa-plus"
            number={30}
            disabled={isSameUser(Number.parseInt(userId))}
            clicked={false}
            onClick={() => {}}
            titleAfterClicked="Subscribed"
            iconAfterClicked="fa-solid fa-minus"
          />
        </div>
      </div>
    </div>
  );
};