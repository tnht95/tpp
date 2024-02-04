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
import { LIMIT, OFFSET } from '@/constant';
import { useAuthCtx, useToastCtx } from '@/context';
import { BlogRequest, BlogSummary, ResponseErr } from '@/models';

const nothingMoreToShow = (
  <div class="mb-8 text-center text-gray-400">--- Nothing more to show ---</div>
);

export const Blogs = () => {
  const {
    utils: { isAdmin }
  } = useAuthCtx();
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
  const [blogs, setBlogs] = createStore<BlogSummary[]>([]);

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
      modal()?.hide();
    });

  const onSubmitHandler = (blog: BlogRequest) =>
    addBlogAction(blog)
      .then(batchSubmitHandler)
      .catch((error: ResponseErr) =>
        dispatch.showToast({ msg: error.msg, type: 'Err' })
      ) as unknown;

  const handleGetMore = () => {
    batch(() => {
      setCurrentOffset(offset => offset + OFFSET);
    });
  };

  return (
    <div class="ml-10 mt-10 w-4/6">
      <div class="flex items-center justify-between">
        <p class="text-4xl font-bold">Blogs</p>
        {isAdmin() && (
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
        )}
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
        <Show when={blogResource().length === LIMIT}>
          <ShowMoreButton vertical onClick={handleGetMore} />
        </Show>
        <Show when={currentOffset() > 0 && blogResource().length < LIMIT}>
          {nothingMoreToShow}
        </Show>
      </div>
    </div>
  );
};
