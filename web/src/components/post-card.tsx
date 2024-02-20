import { batch, createEffect, createSignal, Show } from 'solid-js';

import { likeAction, unLikeAction } from '@/apis';
import { Avatar, CommentForm, Markdown, OptionButton } from '@/components';
import { CommentsProvider, useToastCtx } from '@/context';
import { PostDetails, RespErr } from '@/models';
import { CommentContainer } from '@/parts';
import { authenticationStore } from '@/store';
import { formatTime } from '@/utils';

type Props = {
  post: PostDetails;
  onDelete: (postId: string) => void;
  onEdit: (postId: string, content: string) => void;
};

const getLikeButtonStyle = (isLiked: boolean): string =>
  isLiked ? 'text-red-600 font-bold' : 'cursor-pointer';

export const PostCard = (props: Props) => {
  const { showToast } = useToastCtx();
  const { utils } = authenticationStore;
  const [isEditMode, setIsEditMode] = createSignal(false);
  const [showCmts, setShowCmts] = createSignal({
    show: false,
    hidden: true
  });

  const [isLoading, setIsLoading] = createSignal(false);
  const [liked, setLiked] = createSignal<boolean | undefined>();
  const [likeNumber, setLikeNumber] = createSignal(0);
  const [commentNumber, setCommentNumber] = createSignal(0);

  createEffect(() => {
    setLikeNumber(props.post.likes);
    setLiked(props.post.isLiked);
    setCommentNumber(props.post.comments);
  });

  const likeBatch = () =>
    batch(() => {
      setLikeNumber(oldVal => (liked() ? oldVal - 1 : oldVal + 1));
      setLiked(!liked());
    });

  const onLikeHandler = () => {
    setIsLoading(true);

    const actionPromise = liked()
      ? unLikeAction({ targetType: 'posts', targetId: props.post.id })
      : likeAction({ targetType: 'posts', targetId: props.post.id });

    actionPromise
      .then(likeBatch)
      .catch(error => showToast({ msg: (error as RespErr).msg, type: 'err' }))
      .finally(() => setIsLoading(false)) as unknown;
  };
  const onSubmitPostHandler = (content: string) => {
    setIsEditMode(false);
    props.onEdit(props.post.id, content);
  };

  return (
    <div class="flex flex-col gap-4 rounded-xl border p-10">
      <div class="flex items-center">
        <Avatar img={props.post.userAvatar} userId={props.post.userId} />
        <div class="w-full pl-3 leading-tight">
          <div class="flex items-center justify-between">
            <p class="text-base font-bold text-black">{props.post.userName}</p>
            <Show when={utils.isAuth()}>
              <OptionButton
                isOwner={utils.isSameUser(props.post.userId)}
                onDeleteConfirm={props.onDelete}
                id={props.post.id}
                isEditMode={isEditMode}
                onEditBtnClick={() => setIsEditMode(!isEditMode())}
              />
            </Show>
          </div>
          <span class="block text-sm font-normal text-gray-500">
            {formatTime(props.post.createdAt)}
          </span>
        </div>
      </div>
      <div class="text-xl leading-snug text-black">
        <Show
          when={isEditMode()}
          fallback={<Markdown content={props.post.content} />}
        >
          <CommentForm
            content={props.post.content}
            onSubmit={onSubmitPostHandler}
          />
        </Show>
      </div>
      <div class="flex select-none items-center gap-3 text-gray-500">
        <button
          class={`flex w-1/2 items-center justify-center border-r-2 hover:font-bold hover:text-red-600 ${getLikeButtonStyle(liked() ?? false)}`}
          classList={{ 'cursor-not-allowed': isLoading() }}
          disabled={isLoading()}
          onClick={onLikeHandler}
        >
          <Show when={liked()} fallback={<i class="fa-regular fa-heart" />}>
            <i class="fa-solid fa-heart" />
          </Show>
          <span class="ml-2">{`Like (${likeNumber()})`}</span>
        </button>
        <button
          class="flex w-1/2 cursor-pointer items-center justify-center hover:font-bold hover:text-blue-700"
          onClick={() => setShowCmts(c => ({ show: true, hidden: !c.hidden }))}
        >
          <i class="fa-regular fa-comment" />
          <span class="ml-2">{`Comment (${commentNumber()})`}</span>
        </button>
      </div>
      <Show when={showCmts().show}>
        <div classList={{ hidden: showCmts().hidden }}>
          <CommentsProvider targetType="posts" targetId={props.post.id}>
            <CommentContainer />
          </CommentsProvider>
        </div>
      </Show>
    </div>
  );
};
