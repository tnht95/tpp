import { Comment, CommentForm } from '@/components';
import { GameDetailsTabs } from '@/parts';

export const DiscussionDetails = () => (
  <div>
    <GameDetailsTabs />

    <div class="flex flex-col ml-14 mt-5 w-3/5">
      <div class="border-b  py-5 ">
        <p class="text-3xl font-semibold"> Found bug at abc.com</p>
        <p class="text-base text-gray-400 mt-1">
          On 19 Jan 2011 by Bobby@gmail.com
        </p>
      </div>
      <div class="flex flex-col gap-9 mt-9 pb-9 border-b">
        <Comment
          liked={true}
          likeNumber={10}
          date="20 Nov 2023"
          user="Bob@yahoo.com"
        />
        <Comment
          liked={false}
          likeNumber={2}
          date="20 Nov 2023"
          user="Alen@yahoo.com"
        />
        <Comment
          liked={false}
          likeNumber={0}
          date="23 Nov 2023"
          user="Anna@gmail.com"
        />
        <Comment
          liked={false}
          likeNumber={0}
          date="25 Dec 2023"
          user="Alice@yahoo.com"
        />
        <Comment
          liked={true}
          likeNumber={5}
          date="30 Jan 2024"
          user="Nan@yahoo.com"
        />
      </div>
      <div class="my-9 pl-12 ">
        <CommentForm>New Comment</CommentForm>
      </div>
    </div>
  </div>
);
