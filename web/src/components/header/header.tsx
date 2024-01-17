import { Show, Suspense } from 'solid-js';

import { Searchbar } from '@/components';
import { useAuth } from '@/context';
import { UserMenuGroup } from '@/parts';

import { HeaderLogo } from './header-logo';
import { HeaderMenu } from './header-menu';
import { SignInBtn, SignInBtnSkeleton } from './sign-in';

export const Header = () => {
  const { user, dispatch } = useAuth();

  return (
    <header class="top-0 bg-indigo-900 text-white flex flex-row items-center justify-between sticky z-50">
      <div class=" ml-12 flex items-center h-16 w-3/5">
        <HeaderLogo />
        <HeaderMenu />
        <Searchbar />
      </div>
      <Suspense fallback={<SignInBtnSkeleton />}>
        <Show when={!!user()} fallback={<SignInBtn />}>
          <UserMenuGroup />
          <button onClick={dispatch.logout}>dasdsa</button>
        </Show>
      </Suspense>
    </header>
  );
};
