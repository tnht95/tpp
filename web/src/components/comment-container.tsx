import { Show } from 'solid-js';

import { Avatar, OptionButton } from '@/components';
import { useAuthCtx } from '@/context';
import { Comment } from '@/models';
import { formatTime } from '@/utils';

type CommentProp = {
  comment: Comment;
};
export const CommentContainer = (props: CommentProp) => {
  const {
    utils: { isSameUser }
  } = useAuthCtx();

  return (
    <div class="flex">
      <Avatar />
      <div class="ml-2 w-full">
        <div class="flex items-center justify-between rounded-t border border-gray-200 bg-gray-200 p-2 px-5">
          <div>
            <span class="font-semibold">{props.comment.userName}</span>
            <span> commented on </span>
            <span>{formatTime(props.comment.createdAt)}</span>
          </div>
          <OptionButton
            isOwner={isSameUser(props.comment.userId)}
            onDelete={() => {}}
            id={''}
          />
        </div>

        <div class="rounded-b border border-gray-200 px-5 py-3">
          {props.comment.content}
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
