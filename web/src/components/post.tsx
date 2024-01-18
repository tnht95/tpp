import { createSignal } from 'solid-js';

import { Avatar, Comment, CommentForm, OptionButton } from '@/components';

export const Post = () => {
  const [isHidden, setIsHidden] = createSignal(true);

  const toggleComment = () => {
    setIsHidden(!isHidden());
  };

  return (
    <div class="w-full rounded-xl border bg-white p-10 pb-2">
      <div class="flex justify-between">
        <div class="flex items-center">
          <Avatar />
          <div class="ml-2 leading-tight">
            <span class="block text-base font-bold text-black dark:text-white ">
              Visualize Value
            </span>
            <span class="block text-sm font-normal text-gray-500 dark:text-gray-400">
              22 Jan 2020
            </span>
          </div>
        </div>
        <OptionButton isOwner={true} />
      </div>
      <p class="mt-3 block text-xl leading-snug text-black dark:text-white">
        “No one ever made a decision because of a number. They need a story.” —
        Daniel Kahneman
      </p>
      <img
        class="mt-2 rounded-2xl border border-gray-100 dark:border-gray-700"
        src="https://pbs.twimg.com/media/EpkuplDXEAEjbFc?format=jpg&name=medium"
        alt=""
      />
      <div class="mt-3 flex w-full text-gray-500 ">
        <div class="flex w-full items-center gap-3  py-3">
          <div class="flex w-1/2 cursor-pointer items-center justify-center border-r-2 hover:font-bold hover:text-red-600">
            <i class="fa-regular fa-heart " />
            <span class="ml-2 ">Like (615)</span>
          </div>
          <div
            id="cmtPost"
            class="flex w-1/2 cursor-pointer items-center justify-center hover:font-bold hover:text-blue-700"
            onClick={toggleComment}
          >
            <i class="fa-regular fa-comment" />
            <span class="ml-2">Comment (21)</span>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-5 py-5 " classList={{ hidden: isHidden() }}>
        <Comment user="Ron" date="10 Feb 2022" likeNumber={11} liked={true} />
        <Comment user="Ron" date="10 Feb 2022" likeNumber={1} liked={false} />

        <p class="-mt-1 cursor-pointer text-gray-400 hover:text-gray-600">
          Load more...
        </p>

        <CommentForm />
      </div>
    </div>
  );
};
