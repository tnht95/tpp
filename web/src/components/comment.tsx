import { Show } from 'solid-js';

import { Avatar } from '@/components';

type CommentProp = {
  user: string;
  date: string;
  likeNumber: number;
  liked: boolean;
};
export const Comment = (props: CommentProp) => (
  <div>
    <div class="flex items-start">
      <div class="w-1/12">
        <Avatar />
      </div>
      <div class="ml-2">
        <div class="border  border-gray-200 rounded-t p-2 bg-gray-200 flex items-center">
          <div class="ml-2">
            <span class="font-semibold">{props.user}</span> commented on{' '}
            {props.date}
          </div>
        </div>

        <div class="border border-gray-200 border-t-0 rounded-b px-5 py-3">
          I saw this and this at this website. I'm unable to access the content
          or provide direct assistance with the specific URL you provided, as it
          has returned a 403 (Forbidden) error. However, I can offer general
          guidance and potential troubleshooting steps:
          <div class="mt-2">
            <Show when={props.liked} fallback={<i class="fa-regular fa-heart text-xl hover:text-gray-400  cursor-pointer" />}>
              <i class="fa-solid fa-heart text-xl text-red-500 hover:text-gray-400  cursor-pointer" />
            </Show>
            {props.likeNumber > 0 && <span class="ml-1.5">{props.likeNumber}</span>}
          </div>
        </div>
      </div>
    </div>
  </div>
);
