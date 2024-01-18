import { Show, Suspense } from 'solid-js';

import { Searchbar } from '@/components';
import { useAuth } from '@/context';
import { UserMenuGroup } from '@/parts';

import { HeaderLogo } from './header-logo';
import { HeaderMenu } from './header-menu';
import { SignInBtn, SignInBtnSkeleton } from './sign-in';

export const Header = () => {
  const { user } = useAuth();

  return (
    <header class="sticky top-0 z-50 flex flex-row items-center justify-between bg-indigo-900 text-white">
      <div class=" ml-12 flex h-16 w-3/5 items-center">
        <HeaderLogo />
        <HeaderMenu />
        <Searchbar />
      </div>
      <Suspense fallback={<SignInBtnSkeleton />}>
        <Show when={!!user()} fallback={<SignInBtn />}>
          <UserMenuGroup />
        </Show>
      </Suspense>
    </header>
  );
};
