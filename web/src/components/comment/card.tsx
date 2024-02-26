import { batch, createEffect, createSignal, Show } from 'solid-js';

import { likeAction, unLikeAction } from '@/apis';
import { Avatar, CommentForm, Markdown, OptionButton } from '@/components';
import { useToastCtx } from '@/context';
import { CommentDetails, RespErr } from '@/models';
import { authenticationStore } from '@/store';
import { formatTime } from '@/utils';

type Props = {
  comment: CommentDetails;
  onDelete: (commentId: string) => void;
  onEdit: (commentId: string, content: string) => void;
};

export const CommentCard = (props: Props) => {
  const [isEditMode, setIsEditMode] = createSignal(false);
  const { showToast } = useToastCtx();

  const [isLoading, setIsLoading] = createSignal(false);
  const [liked, setLiked] = createSignal<boolean | undefined>();
  const [likeNumber, setLikeNumber] = createSignal(0);
  const {
    utils: { isSameUser }
  } = authenticationStore;

  createEffect(() => {
    setLikeNumber(props.comment.likes);
    setLiked(props.comment.isLiked);
  });

  const onSubmitHandler = (content: string) => {
    setIsEditMode(false);
    props.onEdit(props.comment.id, content);
  };

  const likeBatch = () =>
    batch(() => {
      setLikeNumber(oldVal => (liked() ? oldVal - 1 : oldVal + 1));
      setLiked(!liked());
    });

  const onLikeHandler = () => {
    setIsLoading(true);

    const actionPromise = liked()
      ? unLikeAction({ targetType: 'comments', targetId: props.comment.id })
      : likeAction({ targetType: 'comments', targetId: props.comment.id });

    actionPromise
      .then(likeBatch)
      .catch(error => showToast({ msg: (error as RespErr).msg, type: 'err' }))
      .finally(() => setIsLoading(false)) as unknown;
  };

  return (
    <div class="flex">
      <Avatar userId={props.comment.userId} img={props.comment.userAvatar} />
      <div class="ml-2 w-full">
        <div class="flex items-center justify-between rounded-t border border-gray-200 bg-gray-200 px-5 py-2">
          <div class="flex items-center gap-1">
            <span class="font-semibold">{props.comment.userName}</span>
            <span> commented on </span>
            <span>{formatTime(props.comment.createdAt)}</span>
          </div>
          <Show when={isSameUser(props.comment.userId)}>
            <OptionButton
              onDeleteConfirm={props.onDelete}
              id={props.comment.id}
              isEditMode={isEditMode}
              onEditBtnClick={() => {
                setIsEditMode(!isEditMode());
              }}
            />
          </Show>
        </div>
        <div class="flex flex-col items-baseline gap-2 rounded-b border border-gray-200 px-5 py-3">
          <Show
            when={isEditMode()}
            fallback={<Markdown content={props.comment.content} />}
          >
            <CommentForm
              content={props.comment.content}
              onSubmit={onSubmitHandler}
            />
          </Show>
          <div>
            <button
              onClick={onLikeHandler}
              disabled={isLoading()}
              class={`${isLoading() ? 'cursor-not-allowed' : 'cursor-pointer'} text-xl hover:text-gray-400`}
            >
              <Show when={liked()} fallback={<i class="fa-regular fa-heart" />}>
                <i class="fa-solid fa-heart cursor-pointer text-red-500" />
              </Show>
            </button>
            <Show when={likeNumber() > 0}>
              <span
                class="ml-1.5"
                classList={{ 'text-red-500 font-bold': liked() }}
              >
                {likeNumber()}
              </span>
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
};
