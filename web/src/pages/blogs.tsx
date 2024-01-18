import { Modal } from 'flowbite';
import { createEffect, createSignal } from 'solid-js';

import { BlogForm, BlogPost } from '@/components';

export const Blogs = () => {
  const [modalRef, setModalRef] = createSignal<HTMLDivElement>();
  const [modal, setModal] = createSignal<Modal>();

  createEffect(() => {
    setModal(new Modal(modalRef()));
  });

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
        />
      </div>
      <div class="mt-5 flex flex-col gap-5">
        <BlogPost />
        <BlogPost />
        <BlogPost />
      </div>
    </div>
  );
};
