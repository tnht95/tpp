import { useParams } from '@solidjs/router';
import { createResource, ErrorBoundary, Suspense } from 'solid-js';

import { fetchDiscussionByIdAction } from '@/apis';
import { Avatar, CommentForm, LoadingSpinner } from '@/components';
import { NotFound } from '@/pages';
import { formatTime } from '@/utils';

export const DiscussionDetails = () => {
  const discussionId = useParams()['discussionId'] as string;

  const [discussion] = createResource(discussionId, fetchDiscussionByIdAction);

  return (
    <Suspense
      fallback={
        <div class="flex h-svh items-center justify-center">
          <LoadingSpinner />
        </div>
      }
    >
      <ErrorBoundary fallback={<NotFound />}>
        <div class="ml-10 flex flex-col">
          <div class="border-b pb-5">
            <p class="text-3xl font-semibold">{discussion()?.title}</p>
            <p class="mt-1 text-base text-gray-400">
              On {formatTime(discussion()?.createdAt as string)} by{' '}
              {discussion()?.userName}
            </p>
          </div>
          <div class="mt-9 flex justify-between border-b pb-9">
            <Avatar img={discussion()?.userAvatar as string} />
            <div class="ml-7 w-full rounded-lg border-2 border-dashed p-5">
              {discussion()?.content}
            </div>
          </div>
          <div class="my-9 pl-12">
            <CommentForm onSubmitHandler={() => {}}>New Comment</CommentForm>
          </div>
        </div>
      </ErrorBoundary>
    </Suspense>
  );
};
