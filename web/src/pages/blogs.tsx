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

import { addBlogAction, fetchBlogAction, fetchBlogTagsAction } from '@/apis';
import { BlogCard, BlogForm, ShowMoreButton } from '@/components';
import { PAGINATION } from '@/constant';
import { useToastCtx } from '@/context';
import { BlogRequest, BlogSummary, RespErr } from '@/models';
import { TagSidebar } from '@/parts';
import { authenticationStore } from '@/store';

export const Blogs = () => {
  const {
    utils: { isAdmin }
  } = authenticationStore;
  const { showToast } = useToastCtx();
  const [modalRef, setModalRef] = createSignal<HTMLDivElement>();
  const [modal, setModal] = createSignal<Modal>();
  const [currentOffset, setCurrentOffset] = createSignal(0);
  const [tagResource] = createResource(fetchBlogTagsAction);
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
      setBlogs(produce(oldBlogs => oldBlogs.push(...blogResource())));
    }
  });

  const resetBlogs = () =>
    batch(() => {
      setBlogs([]);
      showToast({ msg: 'Blog Added', type: 'Ok' });
      if (currentOffset() === 0) refetch() as unknown;
      else setCurrentOffset(0);
      modal()?.hide();
    });

  const onSubmitHandler = (blog: BlogRequest) =>
    addBlogAction(blog)
      .then(resetBlogs)
      .catch((error: RespErr) =>
        showToast({ msg: error.msg, type: 'Err' })
      ) as unknown;

  const handleGetMore = () => {
    setCurrentOffset(offset => offset + PAGINATION);
  };

  return (
    <div class="flex justify-between p-10">
      <div class="flex w-4/6 flex-col gap-5">
        <div class="flex justify-between gap-5">
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
        <div class="flex flex-col gap-5">
          <For each={blogs}>{blog => <BlogCard blog={blog} />}</For>
          <Show when={blogResource().length === PAGINATION}>
            <ShowMoreButton vertical onClick={handleGetMore} />
          </Show>
        </div>
      </div>
      <div class="w-1/6">
        <TagSidebar tags={tagResource() as string[]} />
      </div>
    </div>
  );
};
