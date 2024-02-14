import { createSignal, Show } from 'solid-js';

import { voteAction } from '@/apis';
import { GameForm, OptionButton, PillButton } from '@/components';
import { useGameDetailsCtx, useToastCtx } from '@/context';
import { RespErr } from '@/models';
import { authenticationStore } from '@/store';

export const GameDetailsHeader = () => {
  const {
    game,
    dispatch: { edit, del },
    utils: { gameId },
    modal: { initRef, hide, show }
  } = useGameDetailsCtx();
  const { showToast } = useToastCtx();
  const {
    utils: { isAuth, isSameUser }
  } = authenticationStore;
  const [isUpVotes, setIsUpVotes] = createSignal(
    game()?.isUpVoted ?? undefined
  );
  const [upVotes, setUpVotes] = createSignal(game()?.upVotes ?? 0);

  const onUpVoteHandler = () => {
    voteAction(gameId, { isUp: true })
      .then(() => {
        setUpVotes(oldVal => oldVal + 1);
        return setIsUpVotes(true);
      })
      .catch((error: RespErr) => {
        showToast({ msg: error.msg, type: 'err' });
      });
  };

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
        <Show when={isAuth()}>
          <OptionButton
            isOwner={isSameUser(game()?.authorId as number)}
            onDeleteConfirm={del}
            id={game()?.id as string}
            onEditBtnClick={show}
          />
        </Show>
      </div>
      <div class="flex flex-1 justify-end">
        <div class="flex gap-x-5">
          <PillButton
            title="Upvote"
            number={upVotes()}
            icon="fa-solid fa-angle-up"
            clicked={isUpVotes() === true}
            titleAfterClicked="Upvoted"
            onClick={onUpVoteHandler}
            disabled={!isAuth()}
          />
          <PillButton
            icon="fa-solid fa-angle-down"
            title="Downvote"
            number={200}
            clicked={isUpVotes() === false}
            onClick={() => {}}
            titleAfterClicked="Downvoted"
            disabled={!isAuth()}
          />
        </div>
      </div>
    </div>
  );
};
