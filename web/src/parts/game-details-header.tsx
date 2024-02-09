import { useNavigate } from '@solidjs/router';
import { Modal } from 'flowbite';
import { createEffect, createSignal, Show } from 'solid-js';

import { deleteGameAction, editGameAction } from '@/apis';
import { GameForm, OptionButton, PillButton } from '@/components';
import { useAuthCtx, useGameCtx, useToastCtx } from '@/context';
import { GameRequest, ResponseErr } from '@/models';

export const GameDetailsHeader = () => {
  const {
    gameDetails: {
      data,
      dispatch: { refetch }
    },
    utils: { getGameId }
  } = useGameCtx();
  const {
    dispatch: { showToast }
  } = useToastCtx();
  const {
    utils: { user, isSameUser, isAuth }
  } = useAuthCtx();
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = createSignal(false);
  const [modal, setModal] = createSignal<Modal>();
  const [modalRef, setModalRef] = createSignal<HTMLDivElement>();

  createEffect(() => {
    setModal(
      new Modal(modalRef(), {
        onHide: () => {
          setIsEditMode(false);
        }
      })
    );
  });

  const refresh = () => {
    modal()?.hide();
    showToast({ msg: 'Game Updated', type: 'Ok' });
    return refetch();
  };

  const onClickEditOptionBtn = () => {
    setIsEditMode(!isEditMode());
    modal()?.show();
  };

  const onEditHandler = (file: File, game: GameRequest) => {
    setIsEditMode(false);
    editGameAction(file, game, getGameId())
      .then(refresh)
      .catch((error: ResponseErr) =>
        showToast({ msg: error.msg, type: 'Err' })
      );
  };

  const onDeleteHandler = () => {
    deleteGameAction(data()?.id as string)
      .then(() => {
        navigate(`/users/${user()?.id}`);
        return showToast({ msg: 'Game Deleted', type: 'Ok' });
      })
      .catch((error: ResponseErr) =>
        showToast({ msg: error.msg, type: 'Err' })
      );
  };

  return (
    <div class="flex flex-row">
      <div class="flex w-7/10 items-center gap-2">
        <i class="fa-solid fa-puzzle-piece text-xl text-indigo-900" />
        <div class="cursor-pointer text-2xl font-medium text-indigo-900 hover:underline">
          {data()?.name}
        </div>
        <Show when={data.state === 'ready'}>
          <GameForm
            ref={setModalRef}
            onCloseHandler={() => modal()?.hide()}
            onSubmitHandler={onEditHandler}
            game={data()}
          />
        </Show>
        <OptionButton
          isOwner={user()?.id === data()?.authorId}
          onDelete={onDeleteHandler}
          id={data()?.id as string}
          onEdit={onClickEditOptionBtn}
          isEditMode={isEditMode}
        />
      </div>
      <div class="flex flex-1 justify-end">
        <div class="flex gap-x-5">
          <PillButton
            title="Upvote"
            number={400}
            icon="fa-solid fa-angle-up"
            clicked={false}
            titleAfterClicked="Upvoted"
            onClick={() => {}}
            disabled={isSameUser(data()?.authorId as number) || !isAuth()}
          />
          <PillButton
            icon="fa-solid fa-angle-down"
            title="Downvote"
            number={200}
            clicked={true}
            onClick={() => {}}
            titleAfterClicked="Downvoted"
            disabled={isSameUser(data()?.authorId as number) || !isAuth()}
          />
        </div>
      </div>
    </div>
  );
};
