import { createSignal, Show } from 'solid-js';

import { Avatar, CommentForm, Markdown, OptionButton } from '@/components';
import { CommentsProvider } from '@/context';
import { PostDetails } from '@/models';
import { CommentContainer } from '@/parts';
import { authenticationStore } from '@/store';
import { formatTime } from '@/utils';

type PostCardProps = {
  post: PostDetails;
  onDelete: (postId: string) => void;
  onEdit: (postId: string, content: string) => void;
};

export const PostCard = (props: PostCardProps) => {
  const { utils } = authenticationStore;
  const [isEditMode, setIsEditMode] = createSignal(false);
  const [showCmts, setShowCmts] = createSignal(false);

  const onSubmitPostHandler = (content: string) => {
    setIsEditMode(false);
    props.onEdit(props.post.id, content);
  };

  return (
    <div class="flex flex-col gap-4 rounded-xl border p-10">
      <div class="flex items-center">
        <Avatar img={props.post.authorAvatar} userId={props.post.authorId} />
        <div class="w-full pl-3 leading-tight">
          <div class="flex items-center justify-between">
            <p class="text-base font-bold text-black">
              {props.post.authorName}
            </p>
            <Show when={utils.isAuth()}>
              <OptionButton
                isOwner={utils.isSameUser(props.post.authorId)}
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
        <div class="flex w-1/2 cursor-pointer items-center justify-center border-r-2 hover:font-bold hover:text-red-600">
          <i class="fa-regular fa-heart" />
          <span class="ml-2">{`Like (${props.post.likes})`}</span>
        </div>
        <div
          class="flex w-1/2 cursor-pointer items-center justify-center hover:font-bold hover:text-blue-700"
          onClick={() => setShowCmts(!showCmts())}
        >
          <i class="fa-regular fa-comment" />
          <span class="ml-2">{`Comment (${props.post.comments})`}</span>
        </div>
      </div>
      <Show when={showCmts()}>
        <CommentsProvider targetType="Post" targetId={props.post.id}>
          <CommentContainer />
        </CommentsProvider>
      </Show>
    </div>
  );
};
