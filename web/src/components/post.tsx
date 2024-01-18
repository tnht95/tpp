import { Avatar, Comment, OptionButton } from '@/components';

export const Post = () => (
  <div class="bg-white p-10 rounded-xl border w-full">
    <div class="flex justify-between">
      <div class="flex items-center">
        <Avatar />
        <div class="ml-2 leading-tight">
          <span class="text-black text-base dark:text-white font-bold block ">
            Visualize Value
          </span>
          <span class="text-gray-500 text-sm dark:text-gray-400 font-normal block">
            22 Jan 2020
          </span>
        </div>
      </div>
      <OptionButton id={'post1'} isOwner={true} />
    </div>
    <p class="text-black dark:text-white block text-xl leading-snug mt-3">
      “No one ever made a decision because of a number. They need a story.” —
      Daniel Kahneman
    </p>
    <img
      class="mt-2 rounded-2xl border border-gray-100 dark:border-gray-700"
      src="https://pbs.twimg.com/media/EpkuplDXEAEjbFc?format=jpg&name=medium"
      alt=""
    />
    <div class="text-gray-500 dark:text-gray-400 flex mt-3">
      <div class="flex items-center mr-6 gap-3">
        <div>
          <i class="fa-regular fa-heart cursor-pointer" />
          <span class="ml-2 ">615</span>
        </div>
        <div>
          <i class="fa-regular fa-comment cursor-pointer" />
          <span class="ml-2 cu">21</span>
        </div>
      </div>
    </div>

    <div class="mt-5 flex flex-col gap-5">
      <Comment
        id="cmt11"
        user="d"
        date="Jun 23 2023"
        likeNumber={4}
        liked={false}
      />
    </div>
  </div>
);
