import { useNavigate } from '@solidjs/router';

import { deleteGameAction } from '@/apis';
import { GameTab, OptionButton, PillButton } from '@/components';
import { useAuthCtx, useGameCtx, useToastCtx } from '@/context';
import { ResponseErr } from '@/models';

export const GameDetailsTabs = () => {
  const {
    game: { data }
  } = useGameCtx();
  const { dispatch } = useToastCtx();
  const navigate = useNavigate();
  const {
    utils: { user }
  } = useAuthCtx();

  const onDeleteHandler = () => {
    deleteGameAction(data()?.id as string)
      .then(() => {
        navigate(`/users/${user()?.id}`, { replace: true });
        return dispatch.showToast({ msg: 'Game deleted', type: 'Ok' });
      })
      .catch((error: ResponseErr) => {
        dispatch.showToast({ msg: error.msg, type: 'Err' });
      });
  };

  return (
    <div class="mt-4 overflow-x-hidden px-6 lg:px-10">
      <div class="flex flex-row">
        <div class="flex w-7/10 items-center">
          <i class="fa-solid fa-puzzle-piece mr-2 text-xl text-indigo-900" />
          <div class="mr-3 cursor-pointer text-2xl font-medium text-indigo-900 hover:underline">
            {data()?.name}
          </div>
          <OptionButton
            isOwner={user()?.id === data()?.authorId}
            onDelete={onDeleteHandler}
            id={data()?.id as string}
            onEdit={() => {}}
          />
        </div>

        <div class="flex">
          <div class="flex gap-x-5">
            <PillButton icon="fa-solid fa-plus" title="Subcribe" number={345} />
            <PillButton
              title="Upvote"
              number={400}
              icon="fa-solid fa-angle-up"
            />
            <PillButton
              icon="fa-solid fa-angle-down"
              title="Downvote"
              number={200}
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
          <GameTab
            title="Activity"
            url={`/games/${data()?.id}/activity`}
            icon="fa-regular fa-rectangle-list"
          />
        </div>
      </div>
    </div>
  );
};
