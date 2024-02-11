import { createResource, For, Show } from 'solid-js';

import { fetchBlogTagsAction } from '@/apis';
import { BlogCard, BlogForm, ShowMoreButton } from '@/components';
import { useBlogsCtx } from '@/context';
import { TagSidebar } from '@/parts';
import { authenticationStore } from '@/store';

export const BlogList = () => {
  const {
    utils: { isAdmin }
  } = authenticationStore;
  const {
    blogs,
    utils: { showMore },
    dispatch: { fetchMore, add },
    modal: { show, hide, initRef }
  } = useBlogsCtx();
  const [tagResource] = createResource(fetchBlogTagsAction);
  return (
    <div class="flex justify-between p-10">
      <div class="flex w-4/6 flex-col gap-5">
        <div class="flex justify-between gap-5">
          <p class="text-4xl font-bold">Blogs</p>
          {isAdmin() && (
            <button
              type="button"
              class="rounded-lg border bg-green-500 px-7 py-2 font-bold text-white hover:bg-white hover:text-green-500"
              onClick={show}
            >
              <i class="fa-solid fa-plus mr-2" />
              Add New Blog
            </button>
          )}
          <BlogForm
            modalRef={initRef}
            onCloseHandler={hide}
            onSubmitHandler={add}
          />
        </div>
        <div class="flex flex-col gap-5">
          <For each={blogs}>{blog => <BlogCard blog={blog} />}</For>
          <Show when={showMore()}>
            <ShowMoreButton vertical onClick={fetchMore} />
          </Show>
        </div>
      </div>
      <div class="w-1/6">
        <TagSidebar tags={tagResource() as string[]} />
      </div>
    </div>
  );
};
