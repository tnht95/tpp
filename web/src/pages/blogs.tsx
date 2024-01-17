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
    <div class="w-4/6 ml-10 mt-10">
      <div class="flex items-center justify-between">
        <p class="font-bold text-4xl ">Blogs</p>
        <button
          type="button"
          class="bg-green-400 text-white font-bold hover:text-indigo-900 hover:bg-white border rounded-lg py-2 px-7"
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
      <div class=" flex flex-col gap-5 mt-5">
        <BlogPost />
        <BlogPost />
        <BlogPost />
      </div>
    </div>
  );
};
