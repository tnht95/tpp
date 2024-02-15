import { For, Show } from 'solid-js';

import {
  BlogCard,
  BlogForm,
  LoadingSpinner,
  ShowMoreButton
} from '@/components';
import { useBlogsCtx } from '@/context';
import { authenticationStore } from '@/store';

export const BlogList = () => {
  const {
    utils: { isAdmin }
  } = authenticationStore;
  const {
    blogs,
    utils: { showMore, loading },
    dispatch: { fetchMore, add },
    modal: { show, hide, initRef }
  } = useBlogsCtx();
  return (
    <div class="flex w-4/6 flex-col gap-10">
      <div class="flex justify-between gap-5">
        <p class="text-4xl font-bold">Blogs</p>
        <Show when={isAdmin()}>
          <button
            type="button"
            class="rounded-lg border bg-green-500 px-7 py-2 font-bold text-white hover:bg-white hover:text-green-500"
            onClick={show}
          >
            <i class="fa-solid fa-plus mr-2" />
            Add New Blog
          </button>
          <BlogForm
            modalRef={initRef}
            onCloseHandler={hide}
            onSubmitHandler={add}
          />
        </Show>
      </div>
      <Show when={!loading()} fallback={<LoadingSpinner />}>
        <div class="flex flex-col gap-7">
          <For each={blogs}>{blog => <BlogCard blog={blog} />}</For>
          <Show when={showMore()}>
            <ShowMoreButton vertical onClick={fetchMore} />
          </Show>
        </div>
      </Show>
    </div>
  );
};
