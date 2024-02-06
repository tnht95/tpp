import { createSignal, Show } from 'solid-js';

import { Avatar, CommentForm, Markdown, OptionButton } from '@/components';
import { useAuthCtx } from '@/context';
import { CommentDetails } from '@/models';
import { formatTime } from '@/utils';

type CommentProps = {
  comment: CommentDetails;
  onDelete: (commentId: string) => void;
  onEdit: (commentId: string, content: string) => void;
};

export const CommentContainer = (props: CommentProps) => {
  const [isEditMode, setIsEditMode] = createSignal(false);

  const {
    utils: { isSameUser, isAuth }
  } = useAuthCtx();

  const onSubmitHandler = (content: string) => {
    setIsEditMode(false);
    props.onEdit(props.comment.id, content);
  };

  return (
    <div class="flex">
      <Avatar userId={props.comment.userId} img={props.comment.userAvatar} />
      <div class="ml-2 w-full">
        <div class="flex items-center justify-between rounded-t border border-gray-200 bg-gray-200 p-2 px-5">
          <div>
            <span class="font-semibold">{props.comment.userName}</span>
            <span> commented on </span>
            <span>{formatTime(props.comment.createdAt)}</span>
          </div>
          {isAuth() && (
            <OptionButton
              isOwner={isSameUser(props.comment.userId)}
              onDelete={props.onDelete}
              id={props.comment.id}
              isEditMode={isEditMode}
              onEdit={() => {
                setIsEditMode(!isEditMode());
              }}
            />
          )}
        </div>

        <div class="rounded-b border border-gray-200 px-5 py-3">
          <Show
            when={isEditMode()}
            fallback={<Markdown content={props.comment.content} />}
          >
            <CommentForm
              content={props.comment.content}
              onSubmitHandler={onSubmitHandler}
            />
          </Show>
          <div class="mt-2">
            <Show
              when={props.comment.likes}
              fallback={
                <i class="fa-regular fa-heart cursor-pointer text-xl hover:text-gray-400" />
              }
            >
              <i class="fa-solid fa-heart cursor-pointer text-xl text-red-500 hover:text-gray-400" />
            </Show>
            {props.comment.likes > 0 && (
              <span class="ml-1.5">{props.comment.likes}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
