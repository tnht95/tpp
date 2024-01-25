import { useParams } from '@solidjs/router';
import { Modal } from 'flowbite';
import {
  createEffect,
  createResource,
  createSignal,
  For,
  Show
} from 'solid-js';

import { fetchGameAction, fetchUserByIdAction } from '@/apis';
import { Activity, Button, GameCard, GameForm, PillButton } from '@/components';
import { NotFound } from '@/pages';

export const UserDetails = () => {
  const userID = useParams()['id'] as string;

  const [user] = createResource(userID, fetchUserByIdAction);

  const [games] = createResource({ authorId: userID }, fetchGameAction);
  const [modalRef, setModalRef] = createSignal<HTMLDivElement>();
  const [modal, setModal] = createSignal<Modal>();

  createEffect(() => {
    setModal(new Modal(modalRef()));
  });

  return (
    <Show when={user()} fallback={<NotFound />}>
      <div class="my-5 ml-10 p-5">
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
                <div class="flex flex-col items-center justify-center">
                  <div class="text-sm text-gray-500">
                    <i class="fa-solid fa-link mr-1" />
                    <a href="">{user()?.githubUrl}</a>
                  </div>
                </div>
                <div class="mx-6 mt-6 border-t border-gray-200 pt-6 text-center">
                  <div class="mb-4 flex flex-wrap justify-center">
                    <PillButton
                      title="Subscribe"
                      icon="fa-solid fa-plus"
                      number={30}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div />
          </div>
          <div class="ml-10 mt-6 w-4/6">
            <div class="rounded-xl border bg-white px-8 pb-7 pt-3">
              <div class="mb-5 flex justify-between">
                <div class="flex items-center space-x-2 font-semibold leading-8 text-gray-900">
                  <i class="fa-regular fa-paper-plane text-lg text-green-400" />
                  <span class="tracking-wide">Games</span>
                </div>
                <Button
                  title="Add new game"
                  withIcon="fa-solid fa-plus"
                  customStyle="border-green-400 text-green-500 font-bold hover:bg-green-500 hover:text-white"
                  onClickHandler={() => {
                    modal()?.show();
                  }}
                />
                <GameForm
                  ref={setModalRef}
                  onCloseHandler={() => modal()?.hide()}
                />
              </div>
              <div class="flex flex-wrap items-center gap-7">
                <Show
                  when={games()}
                  fallback={
                    <div class="flex w-full justify-center p-7 text-gray-300">
                      <div>--- Nothing to show ---</div>
                    </div>
                  }
                >
                  <For each={games()}>
                    {game => (
                      <GameCard
                        name={game.name}
                        byUser={game.authorName}
                        stars={game.stars}
                        img={game.avatarUrl}
                      />
                    )}
                  </For>
                </Show>
              </div>
            </div>
            <div class="my-4" />
            <div class="rounded-xl border bg-white p-3">
              <div class="px-8 pt-3">
                <div class="mb-5 items-center space-x-2 font-semibold leading-8 text-gray-900">
                  <i class="fa-regular fa-newspaper text-lg text-green-400" />
                  <span class="tracking-wide">Activity</span>
                </div>
                <ol class="relative border-s border-gray-200 dark:border-gray-700">
                  <Activity
                    title="Bob upload this game"
                    date="09 Jun 2023"
                    latest
                  />
                  <Activity title="Bob upload this game" date="09 Jun 2023" />
                  <Activity title="Bob upload this game" date="09 Jun 2023" />
                  <Activity title="Bob upload this game" date="09 Jun 2023" />
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Show>
  );
};
