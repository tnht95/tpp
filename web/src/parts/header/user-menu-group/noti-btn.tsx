import { Dropdown } from 'flowbite';
import { createEffect, createSignal } from 'solid-js';

import { Notification } from '@/components';

export const NotiBtn = () => {
  const [notiDropdownRef, setNotiDropdownRef] = createSignal<HTMLDivElement>();
  const [notiBtnRef, setNotiBtnRef] = createSignal<HTMLButtonElement>();

  createEffect(() => {
    new Dropdown(notiDropdownRef(), notiBtnRef());
  });

  return (
    <>
      <button
        class="relative py-1.5 text-sm font-medium text-black hover:text-gray-500 focus:outline-none"
        ref={setNotiBtnRef}
      >
        <i class="fa-solid fa-earth-americas text-2xl" />
        <div class="absolute left-4 start-4 top-1.5 block size-3 rounded-full border-2 border-white bg-red-500" />
      </button>
      <div
        class="z-10 hidden w-80 divide-y divide-gray-100 rounded-lg bg-white shadow"
        ref={setNotiDropdownRef}
      >
        <Notification user="Bob@gmail.com" isNew={false} />
        <Notification user="Bob@gmail.com" isNew={true} />
      </div>
    </>
  );
};
