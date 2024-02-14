import { batch, createSignal, Show } from 'solid-js';

import { unVoteAction, voteAction } from '@/apis';
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
  const [currentVote, setCurrentVote] = createSignal(
    game()?.isUpVoted ?? undefined
  );
  const [upVotes, setUpVotes] = createSignal(game()?.upVotes ?? 0);
  const [downVotes, setDownVotes] = createSignal(game()?.downVotes ?? 0);
  const [isLoading, setIsLoading] = createSignal(false);

  const firstVoteHandler = (newVote: boolean): Promise<void> =>
    voteAction(gameId, { isUp: newVote }).then(() =>
      batch(() => {
        newVote
          ? setUpVotes(oldVal => oldVal + 1)
          : setDownVotes(oldVal => oldVal + 1);
        setCurrentVote(newVote);
      })
    );

  const changeVoteHandler = (newVote: boolean): Promise<void> =>
    voteAction(gameId, { isUp: newVote }).then(() =>
      batch(() => {
        if (newVote) {
          setUpVotes(oldVal => oldVal + 1);
          setDownVotes(oldVal => oldVal - 1);
        } else {
          setUpVotes(oldVal => oldVal - 1);
          setDownVotes(oldVal => oldVal + 1);
        }
        setCurrentVote(newVote);
      })
    );

  const unVoteHandler = (newVote: boolean): Promise<void> =>
    unVoteAction(gameId).then(() =>
      batch(() => {
        newVote
          ? setUpVotes(oldVal => oldVal - 1)
          : setDownVotes(oldVal => oldVal - 1);
        setCurrentVote(undefined);
      })
    );

  const onVoteHandler = (newVote: boolean) => {
    setIsLoading(true);

    let votePromise;
    if (currentVote() === undefined) {
      votePromise = firstVoteHandler(newVote);
    } else if (currentVote() === newVote) {
      votePromise = unVoteHandler(newVote);
    } else {
      votePromise = changeVoteHandler(newVote);
    }

    votePromise
      .catch(error => {
        showToast({ msg: (error as RespErr).msg, type: 'err' });
      })
      .finally(() => setIsLoading(false)) as unknown;
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
            clicked={currentVote() === true}
            titleAfterClicked="Upvoted"
            onClick={() => onVoteHandler(true)}
            disabled={!isAuth() || isLoading()}
          />
          <PillButton
            icon="fa-solid fa-angle-down"
            title="Downvote"
            number={downVotes()}
            clicked={currentVote() === false}
            onClick={() => onVoteHandler(false)}
            titleAfterClicked="Downvoted"
            disabled={!isAuth() || isLoading()}
          />
        </div>
      </div>
    </div>
  );
};
