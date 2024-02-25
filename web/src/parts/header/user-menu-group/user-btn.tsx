import { A } from '@solidjs/router';

import { Avatar, EllipsisText } from '@/components';
import { authenticationStore } from '@/store';
import { useDropdownUtils } from '@/utils';

export const UserMenuGroupUserBtn = () => {
  const { user, dispatch } = authenticationStore;
  const dropdown = useDropdownUtils();

  return (
    <>
      <button
        ref={dropdown.initBtnRef}
        class="flex items-center py-0.5 pe-1 text-sm font-bold text-white hover:text-blue-600"
      >
        <div class="pointer-events-none">
          <Avatar img={user()?.avatar as string} />
        </div>
      </button>
      <div
        ref={dropdown.initRef}
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
            onClick={dropdown.hide}
          >
            <i class="fa-solid fa-user" />
            My Page
          </A>
        </div>
        <div class="text-sm text-gray-700">
          <a
            href="#"
            class="flex items-center gap-2 px-4 py-5 hover:bg-gray-100"
            onClick={dispatch.logout}
          >
            <i class="fa-solid fa-arrow-right-from-bracket" />
            Sign out
          </a>
        </div>
      </div>
    </>
  );
};
