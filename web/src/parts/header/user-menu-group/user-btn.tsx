import { A } from '@solidjs/router';
import { Dropdown } from 'flowbite';
import { createEffect, createSignal } from 'solid-js';

import { Avatar, EllipsisText } from '@/components';
import { useAuthCtx } from '@/context';

export const UserBtn = () => {
  const {
    utils: { user },
    dispatch
  } = useAuthCtx();
  const [userDropdownRef, setUserDropdownRef] = createSignal<HTMLDivElement>();
  const [userBtnRef, setUserBtnRef] = createSignal<HTMLButtonElement>();
  const [userDropdown, setUserDropdown] = createSignal<Dropdown>();

  createEffect(() => {
    setUserDropdown(new Dropdown(userDropdownRef(), userBtnRef()));
  });

  return (
    <>
      <button
        ref={setUserBtnRef}
        class="flex items-center py-0.5 pe-1 text-sm font-bold text-white hover:text-blue-600"
      >
        <div class="pointer-events-none">
          <Avatar img={user()?.avatar as string} />
        </div>
      </button>
      <div
        ref={setUserDropdownRef}
        class="z-10 hidden w-52 divide-y divide-gray-100 rounded-lg bg-white shadow"
      >
        <div class="px-4 py-5 text-sm text-gray-900">
          <EllipsisText maxWidth="max-w-40" customStyle="font-bold">
            {user()?.name as string}
          </EllipsisText>
        </div>
        <div class="text-sm text-gray-700">
          <A
            class="flex items-center gap-2 px-4 py-5 hover:bg-gray-100"
            activeClass="bg-gray-100"
            href={`/users/${user()?.id}`}
            onClick={() => {
              userDropdown()?.hide();
            }}
          >
            <i class="fa-solid fa-user" />
            My Page
          </A>
        </div>
        <div class="flex items-center gap-2 rounded-b-lg px-4 py-5 text-gray-700 hover:bg-gray-100">
          <i class="fa-solid fa-arrow-right-from-bracket text-sm" />
          <a href="#" class="block text-sm" onClick={dispatch.logout}>
            Sign out
          </a>
        </div>
      </div>
    </>
  );
};
