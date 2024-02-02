import { useParams } from '@solidjs/router';
import { createResource, ErrorBoundary, Suspense } from 'solid-js';

import { fetchBlogByIdAction } from '@/apis';
import { CommentForm, LoadingSpinner, OptionButton } from '@/components';
import { NotFound } from '@/pages';
import { TagSidebar } from '@/parts';
import { formatTime } from '@/utils';

export const BlogDetails = () => {
  const blogId = useParams()['id'] as string;
  const [blog] = createResource(blogId, fetchBlogByIdAction);

  return (
    <Suspense
      fallback={
        <div class="flex h-svh items-center justify-center">
          <LoadingSpinner />
        </div>
      }
    >
      <ErrorBoundary fallback={<NotFound />}>
        <div class="my-10">
          <div class="ml-20 mt-16">
            <div class="flex justify-between">
              <div class="mb-10 flex w-3/5 flex-col gap-7 rounded-lg border px-10 py-7">
                <div>
                  <div class="flex items-center justify-between">
                    <p class="text-3xl font-bold">{blog()?.title}</p>
                    <OptionButton
                      isOwner={true}
                      onDelete={() => {}}
                      id={''}
                      index={() => -1}
                    />
                  </div>
                  <p class="text-base text-gray-400">
                    {formatTime(blog()?.createdAt as string)}
                  </p>
                </div>
                <p class="text-xl text-gray-600">{blog()?.description}</p>
                <p class="text-lg">{blog()?.content}</p>
              </div>
              <div class="mr-24 w-1/5">
                <TagSidebar tags={blog()?.tags as string[]} />
              </div>
            </div>
            <div class="flex w-3/5 flex-col gap-5">
              <div class="mt-10">
                <CommentForm>New Comment</CommentForm>
              </div>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    </Suspense>
  );
};
