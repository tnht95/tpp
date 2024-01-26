import { Show } from 'solid-js';

import { Avatar, OptionButton } from '@/components';

type CommentProp = {
  user: string;
  date: string;
  likeNumber: number;
  liked: boolean;
};
export const Comment = (props: CommentProp) => (
  <div class="flex">
    <Avatar />
    <div class="ml-2">
      <div class="flex items-center justify-between rounded-t border border-gray-200 bg-gray-200 p-2 px-5">
        <div>
          <span class="font-semibold">{props.user}</span> commented on{' '}
          {props.date}
        </div>
        <OptionButton isOwner={false} onDelete={() => {}} id={''} />
      </div>

      <div class="rounded-b border border-gray-200 px-5 py-3">
        I saw this and this at this website. I'm unable to access the content or
        provide direct assistance with the specific URL you provided, as it has
        returned a 403 (Forbidden) error. However, I can offer general guidance
        and potential troubleshooting steps:
        <div class="mt-2">
          <Show
            when={props.liked}
            fallback={
              <i class="fa-regular fa-heart cursor-pointer text-xl hover:text-gray-400" />
            }
          >
            <i class="fa-solid fa-heart cursor-pointer text-xl text-red-500 hover:text-gray-400" />
          </Show>
          {props.likeNumber > 0 && (
            <span class="ml-1.5">{props.likeNumber}</span>
          )}
        </div>
      </div>
    </div>
  </div>
);
