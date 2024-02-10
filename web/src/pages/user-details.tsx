import { useParams } from '@solidjs/router';
import {
  createResource,
  createSignal,
  ErrorBoundary,
  Show,
  Suspense
} from 'solid-js';

import { fetchUserByIdAction } from '@/apis';
import { LoadingSpinner, PillButton } from '@/components';
import { NotFound } from '@/pages';
import { UserActivity, UserGames } from '@/parts';
import { authenticationStore } from '@/store';

export const UserDetails = () => {
  const {
    utils: { isSameUser }
  } = authenticationStore;
  const [userId] = createSignal(useParams()['id'] as string);
  const [user] = createResource(userId, fetchUserByIdAction);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ErrorBoundary fallback={<NotFound />}>
        <div class="mx-10 my-5 p-5">
          <div class="md:-mx-2 md:flex">
            <div class="w-full md:mx-2 md:w-3/12">
              <div class="group my-6 w-full min-w-0 max-w-md break-words rounded-xl border bg-white">
                <div>
                  <div class="flex flex-wrap justify-center">
                    <div class="flex w-full justify-center">
                      <div class="relative">
                        <img
                          src={user()?.avatar as string}
                          class="absolute -m-16 max-w-[150px] rounded-full border-8 border-white align-middle lg:-ml-16"
                          alt="d"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="mt-20 flex justify-center text-center">
                    <h3 class="text-2xl font-bold leading-normal text-gray-700">
                      {user()?.name}
                    </h3>
                  </div>
                  <div class="mt-2 flex flex-col items-center justify-center gap-2">
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
                  <div class="mx-6 mt-6 border-t border-gray-200 pt-6 text-center">
                    <div class="mb-4 flex flex-wrap justify-center">
                      <PillButton
                        title="Subscribe"
                        icon="fa-solid fa-plus"
                        number={30}
                        disabled={isSameUser(Number.parseInt(userId()))}
                        clicked={false}
                        onClick={() => {}}
                        titleAfterClicked="Subscribed"
                        iconAfterClicked="fa-solid fa-minus"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div />
            </div>
            <div class="ml-14 mt-6 flex w-3/4 flex-col gap-10">
              <Show when={user.state === 'ready'}>
                <UserGames userId={user()?.id as number} />
                <UserActivity />
              </Show>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    </Suspense>
  );
};
