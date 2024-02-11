import { For, Show } from 'solid-js';

import { Button, GameCard, GameForm, ShowMoreButton } from '@/components';
import { UserGamesProvider, useUserGamesCtx } from '@/context';
import { authenticationStore } from '@/store';

export const UserGames = () => (
  <UserGamesProvider>
    <UserGamesInner />
  </UserGamesProvider>
);

const UserGamesInner = () => {
  const {
    utils: { isSameUser }
  } = authenticationStore;
  const {
    games,
    dispatch: { add, fetchMore },
    utils: { showMore, userId },
    modal: { initRef, show, hide }
  } = useUserGamesCtx();
  return (
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
      <div class="flex flex-wrap items-stretch gap-7">
        <Show when={games.length > 0} fallback={nothingToShow}>
          <For each={games}>{game => <GameCard game={game} />}</For>
          <Show when={showMore()}>
            <ShowMoreButton onClick={fetchMore} />
          </Show>
        </Show>
      </div>
    </div>
  );
};

const nothingToShow = (
  <div class="flex w-full justify-center p-7 text-gray-300">
    <div>--- Nothing to show ---</div>
  </div>
);
