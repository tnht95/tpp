import { Show } from 'solid-js';

import { Avatar, OptionButton } from '@/components';

type CommentProp = {
  user: string;
  date: string;
  likeNumber: number;
  liked: boolean;
  id: string;
};
export const Comment = (props: CommentProp) => (
  <div class="flex">
    <Avatar />
    <div class="ml-2">
      <div class="px-5 border border-gray-200 rounded-t p-2 bg-gray-200 flex items-center justify-between">
        <div>
          <span class="font-semibold">{props.user}</span> commented on{' '}
          {props.date}
        </div>
        <OptionButton isOwner={false} id={props.id} />
      </div>

      <div class="border border-gray-200 bor der-t-0 rounded-b px-5 py-3">
        I saw this and this at this website. I'm unable to access the content or
        provide direct assistance with the specific URL you provided, as it has
        returned a 403 (Forbidden) error. However, I can offer general guidance
        and potential troubleshooting steps:
        <div class="mt-2">
          <Show
            when={props.liked}
            fallback={
              <i class="fa-regular fa-heart text-xl hover:text-gray-400  cursor-pointer" />
            }
          >
            <i class="fa-solid fa-heart text-xl text-red-500 hover:text-gray-400  cursor-pointer" />
          </Show>
          {props.likeNumber > 0 && (
            <span class="ml-1.5">{props.likeNumber}</span>
          )}
        </div>
      </div>
    </div>
  </div>
);
