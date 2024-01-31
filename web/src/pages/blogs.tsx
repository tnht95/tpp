import { Modal } from 'flowbite';
import {
  batch,
  createEffect,
  createResource,
  createSignal,
  For,
  Show
} from 'solid-js';
import { createStore, produce } from 'solid-js/store';

import { addBlogAction, fetchBlogAction } from '@/apis';
import { BlogCard, BlogForm, ShowMoreButton } from '@/components';
import { useToastCtx } from '@/context';
import { AddBlog, BlogSummary, ResponseErr } from '@/models';

const nothingMoreToShow = (
  <div class="mb-8 text-center text-gray-400">--- Nothing more to show ---</div>
);

export const Blogs = () => {
  const { dispatch } = useToastCtx();
  const [modalRef, setModalRef] = createSignal<HTMLDivElement>();
  const [modal, setModal] = createSignal<Modal>();
  const [currentOffset, setCurrentOffset] = createSignal(0);
  const [blogResource, { refetch }] = createResource(
    currentOffset,
    fetchBlogAction,
    {
      initialValue: []
    }
  );
  const [blogs, setBlogs] = createStore<BlogSummary[]>(blogResource());

  createEffect(() => {
    setModal(new Modal(modalRef()));
    if (blogResource().length > 0) {
      batch(() => {
        setBlogs(produce(oldBlogs => oldBlogs.push(...blogResource())));
      });
    }
  });

  const batchSubmitHandler = () =>
    batch(() => {
      setBlogs([]);
      if (currentOffset() === 0) refetch() as unknown;
      else setCurrentOffset(0);
    });

  const onSubmitHandler = (blog: AddBlog) =>
    addBlogAction(blog)
      .then(batchSubmitHandler)
      .catch((error: ResponseErr) => dispatch.showToast(error.msg)) as unknown;

  const handleGetMore = () => {
    batch(() => {
      setCurrentOffset(offset => offset + 2);
    });
  };

  return (
    <div class="ml-10 mt-10 w-4/6">
      <div class="flex items-center justify-between">
        <p class="text-4xl font-bold">Blogs</p>
        <button
          type="button"
          class="rounded-lg border bg-green-500 px-7 py-2 font-bold text-white hover:bg-white hover:text-green-500"
          onClick={() => {
            modal()?.show();
          }}
        >
          <i class="fa-solid fa-plus mr-2" />
          Add New Blog
        </button>
        <BlogForm
          modalRef={setModalRef}
          onCloseHandler={() => {
            modal()?.hide();
          }}
          onSubmitHandler={onSubmitHandler}
        />
      </div>
      <div class="mt-5 flex flex-col gap-5">
        <For each={blogs}>{blog => <BlogCard blog={blog} />}</For>
        <Show when={blogResource().length > 1} fallback={nothingMoreToShow}>
          <ShowMoreButton vertical onClick={handleGetMore} />
        </Show>
      </div>
    </div>
  );
};
