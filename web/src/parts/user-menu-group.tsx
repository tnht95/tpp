import { Dropdown } from 'flowbite';
import { createEffect, createSignal } from 'solid-js';

import { Avatar, EllipsisText, Notification } from '@/components';
import { useAuth } from '@/context';

export const UserMenuGroup = () => {
  const { dispatch } = useAuth();
  const [userDropdownRef, setUserDropdownRef] = createSignal<HTMLDivElement>();
  const [userBtnRef, setUserBtnRef] = createSignal<HTMLButtonElement>();
  const [userDropdown, setUserDropdown] = createSignal<Dropdown>();

  const [notiDropdownRef, setNotiDropdownRef] = createSignal<HTMLDivElement>();
  const [notiBtnRef, setNotiBtnRef] = createSignal<HTMLButtonElement>();

  createEffect(() => {
    setUserDropdown(new Dropdown(userDropdownRef(), userBtnRef()));
    new Dropdown(notiDropdownRef(), notiBtnRef());
  });

  return (
    <div class="flex gap-7 items-center">
      <button
        class="py-1.5 relative text-sm font-medium text-black hover:text-gray-500 focus:outline-none "
        ref={setNotiBtnRef}
      >
        <i class="fa-solid fa-earth-americas text-2xl" />

        <div class="absolute block w-3 h-3 bg-red-500 border-2 border-white rounded-full left-4 top-1.5 start-4" />
      </button>

      <div
        class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-80"
        ref={setNotiDropdownRef}
      >
        <Notification user="Bob@gmail.com" isNew={false} />
        <Notification user="Bob@gmail.com" isNew={true} />
      </div>

      <button
        ref={setUserBtnRef}
        class="py-0.5 mr-10 flex text-white font-bold items-center text-sm pe-1 hover:text-blue-600"
      >
        <span class="sr-only">Open user menu</span>
        <Avatar />
      </button>

      <div
        ref={setUserDropdownRef}
        class="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-52 hidden"
      >
        <div class="px-4 py-5 text-sm text-gray-900">
          <EllipsisText maxWidth="max-w-40" customStyle="font-bold">
            name@flowbite.comfsdfdsfsfs
          </EllipsisText>
        </div>
        <div class=" text-sm text-gray-700 ">
          <div class="py-5 hover:bg-gray-100 flex items-center px-4 gap-2">
            <i class="fa-solid fa-user" />
            <a
              href="/users/d"
              class=" "
              onClick={() => {
                userDropdown()?.hide();
              }}
            >
              My Page
            </a>
          </div>
        </div>
        <div class="py-5 hover:bg-gray-100 flex text-gray-700 items-center px-4 rounded-b-lg gap-2">
          <i class="fa-solid fa-arrow-right-from-bracket text-sm " />
          <a
            href="#"
            class="block text-sm "
            onClick={() => {
              dispatch.logout();
            }}
          >
            Sign out
          </a>
        </div>
      </div>
    </div>
  );
};
