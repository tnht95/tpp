import { CommentForm } from '@/components';
import { GameDetailsTabs } from '@/parts';

export const DiscussionDetails = () => (
  <div>
    <GameDetailsTabs />

    <div class="ml-14 mt-5 flex w-3/5 flex-col">
      <div class="border-b py-5">
        <p class="text-3xl font-semibold"> Found bug at abc.com</p>
        <p class="mt-1 text-base text-gray-400">
          On 19 Jan 2011 by Bobby@gmail.com
        </p>
      </div>
      <div class="mt-9 flex flex-col gap-9 border-b pb-9" />
      <div class="my-9 pl-12">
        <CommentForm>New Comment</CommentForm>
      </div>
    </div>
  </div>
);
