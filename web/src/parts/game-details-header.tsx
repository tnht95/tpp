import { GameForm, OptionButton, PillButton } from '@/components';
import { useAuthCtx, useGameDetailsCtx } from '@/context';

export const GameDetailsHeader = () => {
  const {
    game,
    dispatch: { edit, del },
    utils: { isEditMode },
    modal: { initRef, hide, show }
  } = useGameDetailsCtx();
  const {
    utils: { user, isSameUser, isAuth }
  } = useAuthCtx();
  return (
    <div class="flex flex-row">
      <div class="flex w-7/10 items-center gap-2">
        <i class="fa-solid fa-puzzle-piece text-xl text-indigo-900" />
        <div class="cursor-pointer text-2xl font-medium text-indigo-900 hover:underline">
          {game()?.name}
        </div>
        <GameForm
          ref={initRef}
          onCloseHandler={hide}
          onSubmitHandler={edit}
          game={game()}
        />
        <OptionButton
          isOwner={user()?.id === game()?.authorId}
          onDelete={del}
          id={game()?.id as string}
          onEdit={show}
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
            disabled={isSameUser(game()?.authorId as number) || !isAuth()}
          />
          <PillButton
            icon="fa-solid fa-angle-down"
            title="Downvote"
            number={200}
            clicked={true}
            onClick={() => {}}
            titleAfterClicked="Downvoted"
            disabled={isSameUser(game()?.authorId as number) || !isAuth()}
          />
        </div>
      </div>
    </div>
  );
};
