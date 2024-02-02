import { Modal } from 'flowbite';
import {
  batch,
  createEffect,
  createResource,
  createSignal,
  For,
  Show
} from 'solid-js';
import { createStore, produce } from 'solid-js/store';

import { addGameAction, fetchGameAction } from '@/apis';
import { Button, GameCard, GameForm } from '@/components';
import { useAuthCtx, useToastCtx } from '@/context';
import { AddGame, GameSummary, ResponseErr } from '@/models';

type UserGamesProps = {
  userId: number;
};

export const UserGames = (props: UserGamesProps) => {
  const {
    utils: { isSameUser }
  } = useAuthCtx();
  const { dispatch } = useToastCtx();
  const [userId] = createSignal({ authorId: props.userId });
  const [gameResource] = createResource(userId, fetchGameAction, {
    initialValue: []
  });
  const [games, setGames] = createStore<GameSummary[]>([]);

  const [modalRef, setModalRef] = createSignal<HTMLDivElement>();
  const [modal, setModal] = createSignal<Modal>();

  const batchSubmitHandler = (game: GameSummary) =>
    batch(() => {
      setGames(produce(oldGames => oldGames.push(game)));
      modal()?.hide();
    });

  const onSubmitHandler = (file: File, game: AddGame) =>
    addGameAction(file, game)
      .then(batchSubmitHandler)
      .catch((error: ResponseErr) =>
        dispatch.showToast({ msg: error.msg, type: 'Err' })
      ) as unknown;

  createEffect(() => {
    setModal(new Modal(modalRef()));
    if (gameResource().length > 0) {
      setGames(produce(oldGames => oldGames.push(...gameResource())));
    }
  });

  return (
    <div class="rounded-xl border bg-white px-8 pb-7 pt-3">
      <div class="mb-5 flex justify-between">
        <div class="flex items-center space-x-2 font-semibold leading-8 text-gray-900">
          <i class="fa-regular fa-paper-plane text-lg text-green-400" />
          <span class="tracking-wide">Games</span>
        </div>
        {isSameUser(props.userId) && (
          <Button
            title="Add new game"
            withIcon="fa-solid fa-plus"
            customStyle="border-green-400 text-green-500 font-bold hover:bg-green-500 hover:text-white"
            onClickHandler={() => {
              modal()?.show();
            }}
          />
        )}
        <GameForm
          ref={setModalRef}
          onCloseHandler={() => modal()?.hide()}
          onSubmitHandler={onSubmitHandler}
        />
      </div>
      <div class="flex flex-wrap items-center gap-7">
        <Show when={games.length > 0} fallback={nothingMoreToShow}>
          <For each={games}>
            {game => (
              <GameCard
                name={game.name}
                byUser={game.authorName}
                stars={game.stars}
                img={game.avatarUrl}
                id={game.id}
              />
            )}
          </For>
        </Show>
      </div>
    </div>
  );
};

const nothingMoreToShow = (
  <div class="flex w-full justify-center p-7 text-gray-300">
    <div>--- Nothing more to show ---</div>
  </div>
);
