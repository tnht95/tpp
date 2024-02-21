import { batch, createEffect, createSignal, Show } from 'solid-js';

import { likeAction, unLikeAction } from '@/apis';
import { Avatar, DiscussionForm, Markdown, OptionButton } from '@/components';
import {
  CommentsProvider,
  GameDiscussionDetailsProvider,
  useGameDiscussionDetailsCtx,
  useToastCtx
} from '@/context';
import { RespErr } from '@/models';
import { CommentContainer } from '@/parts';
import { authenticationStore } from '@/store';
import { formatTime } from '@/utils';

export const GameDetailsDiscussionDetails = () => (
  <GameDiscussionDetailsProvider>
    <GameDetailsDiscussionDetailsInner />
  </GameDiscussionDetailsProvider>
);

const GameDetailsDiscussionDetailsInner = () => {
  const {
    utils: { isSameUser }
  } = authenticationStore;
  const {
    discussion,
    dispatch: { edit, del },
    modal: { initRef, show, hide },
    utils: { discussionId }
  } = useGameDiscussionDetailsCtx();
  const { showToast } = useToastCtx();

  const [isLoading, setIsLoading] = createSignal(false);
  const [liked, setLiked] = createSignal<boolean | undefined>();
  const [likeNumber, setLikeNumber] = createSignal(0);
  const [commentNumber, setCommentNumber] = createSignal(0);

  createEffect(() => {
    setLikeNumber(discussion().likes);
    setLiked(discussion().isLiked);
    setCommentNumber(discussion().comments);
  });

  const likeBatch = () =>
    batch(() => {
      setLikeNumber(oldVal => (liked() ? oldVal - 1 : oldVal + 1));
      setLiked(!liked());
    });

  const onLikeHandler = () => {
    setIsLoading(true);

    const actionPromise = liked()
      ? unLikeAction({ targetType: 'discussions', targetId: discussion().id })
      : likeAction({ targetType: 'discussions', targetId: discussion().id });

    actionPromise
      .then(likeBatch)
      .catch(error => showToast({ msg: (error as RespErr).msg, type: 'err' }))
      .finally(() => setIsLoading(false)) as unknown;
  };

  return (
    <div class="flex flex-col gap-7 px-5">
      <div class="border-b pb-5">
        <div class="flex items-center">
          <p class="mr-3 text-3xl font-bold">{discussion().title}</p>
          <OptionButton
            isOwner={isSameUser(discussion().userId)}
            onDeleteConfirm={del}
            id={discussionId}
            onEditBtnClick={show}
          />
          <DiscussionForm
            ref={initRef}
            onCloseHandler={hide}
            onSubmitHandler={edit}
            discussion={discussion()}
          />
        </div>
        <p class="mt-1.5 text-base text-gray-400">
          On {formatTime(discussion().createdAt)} by{' '}
          <a
            target="_blank"
            href={`/users/${discussion().userId}`}
            class="font-bold hover:text-gray-600 hover:underline"
          >
            {discussion().userName}
          </a>
        </p>
      </div>
      <div class="flex gap-5 border-b pb-9">
        <Avatar img={discussion().userAvatar} userId={discussion().userId} />
        <div class="w-full rounded-lg border-2 border-dashed p-5">
          <Markdown content={discussion().content} />
          <div class="mt-2 flex items-center gap-1.5">
            <button
              onClick={onLikeHandler}
              disabled={isLoading()}
              class={`${isLoading() ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <Show when={liked()} fallback={<i class="fa-regular fa-heart" />}>
                <i class="fa-solid fa-heart text-red-500" />
              </Show>
            </button>
            <Show when={likeNumber() > 0}>
              <span classList={{ 'text-red-500 font-bold': liked() }}>
                {likeNumber()}
              </span>
            </Show>
          </div>
        </div>
      </div>
      <CommentsProvider
        targetType="discussions"
        targetId={discussionId}
        onAddNewCmt={() => setCommentNumber(c => c + 1)}
        onDeleteCmt={() => setCommentNumber(c => c - 1)}
      >
        <div class="flex flex-col">
          <Show when={commentNumber() > 0}>
            <div class="mb-2 text-lg font-semibold">
              <i class="fa-regular fa-comment-dots mr-1.5" />
              <span>{commentNumber()} comment(s)</span>
            </div>
          </Show>
          <CommentContainer />
        </div>
      </CommentsProvider>
    </div>
  );
};
