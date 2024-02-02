import { useNavigate } from '@solidjs/router';

import { deleteGameAction } from '@/apis';
import { GameTab, OptionButton, PillButton } from '@/components';
import { useAuthCtx, useGameCtx, useToastCtx } from '@/context';
import { ResponseErr } from '@/models';

export const GameDetailsTabs = () => {
  const { game } = useGameCtx();
  const { dispatch } = useToastCtx();
  const navigate = useNavigate();
  const {
    utils: { user }
  } = useAuthCtx();

  const onDeleteHandler = () => {
    deleteGameAction(game()?.id as string).catch((error: ResponseErr) => {
      dispatch.showToast({ msg: error.msg, type: 'Err' });
    });

    navigate(`/users/${user()?.id}`, { replace: true });
    dispatch.showToast({ msg: 'Game deleted', type: 'Ok' });
  };

  return (
    <div class="mt-4 overflow-x-hidden px-6 lg:px-10">
      <div class="flex flex-row">
        <div class="flex w-7/10 items-center">
          <i class="fa-solid fa-puzzle-piece mr-2 text-xl text-indigo-900" />
          <div class="mr-3 cursor-pointer text-2xl font-medium text-indigo-900 hover:underline">
            {game()?.name}
          </div>
          <OptionButton
            isOwner={user()?.id === game()?.authorId}
            onDelete={onDeleteHandler}
            id={game()?.id as string}
            index={() => -1}
          />
        </div>

        <div class="flex">
          <div class="flex gap-x-5">
            <PillButton icon="fa-solid fa-plus" title="Subcribe" number={345} />
            <PillButton
              title="Star"
              number={game()?.stars as number}
              icon="fa-solid fa-star"
            />
          </div>
        </div>
      </div>

      <div class="-mx-10 mt-6 flex select-none items-center justify-between border-b px-10">
        <div class="flex">
          <GameTab
            title="Info"
            url={`/games/${game()?.id}/info`}
            icon="fa-regular fa-lightbulb"
          />
          <GameTab
            title="Discussion"
            url={`/games/${game()?.id}/discussion`}
            icon="fa-regular fa-comment-dots"
          />
          <GameTab
            title="Activity"
            url={`/games/${game()?.id}/activity`}
            icon="fa-regular fa-rectangle-list"
          />
        </div>
      </div>
    </div>
  );
};
