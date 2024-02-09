import { useNavigate } from '@solidjs/router';
import { Modal } from 'flowbite';
import { createEffect, createSignal, Show } from 'solid-js';

import { deleteGameAction, editGameAction } from '@/apis';
import { GameForm, GameTab, OptionButton, PillButton } from '@/components';
import { useAuthCtx, useGameCtx, useToastCtx } from '@/context';
import { GameRequest, ResponseErr } from '@/models';

export const GameDetailsTabs = () => {
  const {
    utils: { isAuth }
  } = useAuthCtx();
  const {
    game: { data, refetch },
    utils: { getGameId }
  } = useGameCtx();
  const { dispatch } = useToastCtx();
  const navigate = useNavigate();
  const {
    utils: { user }
  } = useAuthCtx();
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

  const onEditBlogHandler = (file: File, game: GameRequest) => {
    setIsEditMode(false);
    editGameAction(file, game, getGameId())
      .then(refresh)
      .catch((error: ResponseErr) =>
        dispatch.showToast({ msg: error.msg, type: 'Err' })
      );
  };

  const refresh = () => {
    modal()?.hide();
    dispatch.showToast({ msg: 'Game Updated', type: 'Ok' });
    return refetch();
  };

  const onDeleteHandler = () => {
    deleteGameAction(data()?.id as string)
      .then(() => {
        navigate(`/users/${user()?.id}`);
        return dispatch.showToast({ msg: 'Game Deleted', type: 'Ok' });
      })
      .catch((error: ResponseErr) => {
        dispatch.showToast({ msg: error.msg, type: 'Err' });
      });
  };

  const onEditOptionBtn = () => {
    setIsEditMode(!isEditMode());
    modal()?.show();
  };

  return (
    <div class="mt-4 overflow-x-hidden px-6 lg:px-10">
      <div class="flex flex-row">
        <div class="flex w-7/10 items-center">
          <i class="fa-solid fa-puzzle-piece mr-2 text-xl text-indigo-900" />
          <div class="mr-3 cursor-pointer text-2xl font-medium text-indigo-900 hover:underline">
            {data()?.name}
          </div>
          <Show when={data.state === 'ready'}>
            <GameForm
              ref={setModalRef}
              onCloseHandler={() => {
                modal()?.hide();
              }}
              onSubmitHandler={onEditBlogHandler}
              game={data()}
            />
          </Show>
          <OptionButton
            isOwner={user()?.id === data()?.authorId}
            onDelete={onDeleteHandler}
            id={data()?.id as string}
            onEdit={onEditOptionBtn}
            isEditMode={isEditMode}
          />
        </div>

        <div class="flex">
          <div class="flex gap-x-5">
            <PillButton
              title="Upvote"
              number={400}
              icon="fa-solid fa-angle-up"
              clicked={false}
              titleAfterClicked="Upvoted"
              onClick={() => {}}
              disabled={!isAuth()}
            />
            <PillButton
              icon="fa-solid fa-angle-down"
              title="Downvote"
              number={200}
              clicked={true}
              onClick={() => {}}
              titleAfterClicked="Downvoted"
              disabled={!isAuth()}
            />
          </div>
        </div>
      </div>

      <div class="-mx-10 mt-6 flex select-none items-center justify-between border-b px-10">
        <div class="flex">
          <GameTab
            title="Info"
            url={`/games/${data()?.id}/info`}
            icon="fa-regular fa-lightbulb"
          />
          <GameTab
            title="Discussion"
            url={`/games/${data()?.id}/discussion`}
            icon="fa-regular fa-comment-dots"
          />
        </div>
      </div>
    </div>
  );
};
