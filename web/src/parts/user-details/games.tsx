import { For, Show } from 'solid-js';

import {
  Button,
  GameCard,
  GameForm,
  LoadingSpinner,
  ShowMoreButton
} from '@/components';
import { ActivitiesProvider, useUserGamesCtx } from '@/context';
import { authenticationStore } from '@/store';

import { UserActivity } from './activity';

export const UserDetailsGames = () => {
  const {
    utils: { isSameUser }
  } = authenticationStore;
  const {
    games,
    dispatch: { add, fetchMore },
    utils: { showMore, loading, userId },
    modal: { initRef, show, hide }
  } = useUserGamesCtx();
  return (
    <div class="flex flex-1 flex-col gap-10">
      <div class="rounded-xl border bg-white px-8 pb-10 pt-3">
        <div class="mb-5 flex justify-between">
          <div class="flex items-center space-x-2 font-semibold leading-8 text-gray-900">
            <i class="fa-regular fa-paper-plane text-lg text-green-400" />
            <span class="tracking-wide">Games</span>
          </div>
          {isSameUser(userId) && (
            <Button
              title="Add new game"
              withIcon="fa-solid fa-plus"
              customStyle="border-green-400 text-green-500 font-bold hover:bg-green-500 hover:text-white"
              onClickHandler={show}
            />
          )}
          <GameForm ref={initRef} onCloseHandler={hide} onSubmitHandler={add} />
        </div>
        <Show when={!loading()} fallback={<LoadingSpinner />}>
          <div class="flex flex-wrap items-stretch gap-7">
            <Show when={games.length > 0} fallback={nothingToShow}>
              <For each={games}>{game => <GameCard game={game} />}</For>
              <Show when={showMore()}>
                <ShowMoreButton onClick={fetchMore} />
              </Show>
            </Show>
          </div>
        </Show>
      </div>
      <ActivitiesProvider userId={userId}>
        <UserActivity />
      </ActivitiesProvider>
    </div>
  );
};

const nothingToShow = (
  <div class="flex w-full justify-center p-7 text-gray-300">
    <div>--- Nothing to show ---</div>
  </div>
);
