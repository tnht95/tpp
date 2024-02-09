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

import { addGameAction, fetchGameAction, GameQueryInput } from '@/apis';
import { Button, GameCard, GameForm, ShowMoreButton } from '@/components';
import { useAuthCtx, useToastCtx } from '@/context';
import { GameRequest, GameSummary, RespErr } from '@/models';

type UserGamesProps = {
  userId: number;
};

const gameUserLimit = 9;
export const UserGames = (props: UserGamesProps) => {
  const {
    utils: { isSameUser }
  } = useAuthCtx();
  const defaultParam: GameQueryInput = {
    // eslint-disable-next-line solid/reactivity
    authorId: props.userId,
    offset: 0,
    limit: gameUserLimit,
    orderBy: 'desc',
    orderField: 'createdAt'
  };

  const { dispatch } = useToastCtx();
  const [param, setParam] = createSignal(defaultParam);
  const [gameResource, { refetch }] = createResource(param, fetchGameAction, {
    initialValue: []
  });
  const [games, setGames] = createStore<GameSummary[]>([]);

  const [modalRef, setModalRef] = createSignal<HTMLDivElement>();
  const [modal, setModal] = createSignal<Modal>();

  createEffect(() => {
    setModal(new Modal(modalRef()));
    if (gameResource().length > 0) {
      setGames(produce(oldGames => oldGames.push(...gameResource())));
    }
  });

  const batchSubmitHandler = () =>
    batch(() => {
      dispatch.showToast({ msg: 'Game Added', type: 'Ok' });
      setGames([]);
      setParam(defaultParam);
      modal()?.hide();
      return refetch();
    });

  const onSubmitHandler = (file: File, game: GameRequest) =>
    addGameAction(file, game)
      .then(batchSubmitHandler)
      .catch((error: RespErr) =>
        dispatch.showToast({ msg: error.msg, type: 'Err' })
      ) as unknown;

  const onShowMoreHandler = () => {
    setParam(oldValue => ({
      ...oldValue,
      offset: (oldValue.offset as number) + gameUserLimit
    }));
  };

  return (
    <div class="rounded-xl border bg-white px-8 pb-10 pt-3">
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
      <div class="flex flex-wrap items-stretch gap-7">
        <Show when={games.length > 0} fallback={nothingToShow}>
          <For each={games}>{game => <GameCard game={game} />}</For>
          <Show when={gameResource().length === gameUserLimit}>
            <ShowMoreButton onClick={onShowMoreHandler} />
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
