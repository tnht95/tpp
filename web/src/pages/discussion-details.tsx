import { Comment, CommentForm } from '@/components';
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
      <div class="mt-9 flex flex-col gap-9 border-b pb-9">
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
      <div class="my-9 pl-12">
        <CommentForm>New Comment</CommentForm>
      </div>
    </div>
  </div>
);
