import { Modal } from 'flowbite';
import {
  createEffect,
  createResource,
  createSignal,
  For,
  Show
} from 'solid-js';

import { fetchGameAction } from '@/apis';
import { Button, GameCard, GameForm } from '@/components';

type UserGamesProp = {
  userId: number;
};

export const UserGames = (props: UserGamesProp) => {
  const [userId] = createSignal({ authorId: props.userId });
  const [games] = createResource(userId, fetchGameAction);
  const [modalRef, setModalRef] = createSignal<HTMLDivElement>();
  const [modal, setModal] = createSignal<Modal>();

  createEffect(() => {
    setModal(new Modal(modalRef()));
  });

  return (
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
        <GameForm ref={setModalRef} onCloseHandler={() => modal()?.hide()} />
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
  );
};
