import { Show } from 'solid-js';

import { Searchbar } from '@/components';
import { UserMenuGroup } from '@/parts';

import { HeaderLogo } from './header-logo';
import { HeaderMenu } from './header-menu';

type HeaderProps = {
  isAuthenticated: boolean;
};
export const Header = (props: HeaderProps) => {
  const signInButton = (
    <button class="border border-white rounded-full font-bold px-8 py-2  hover:bg-white hover:text-indigo-900 mr-12">
      Sign In
    </button>
  );

  return (
    <header class="top-0 bg-indigo-900 text-white flex flex-row items-center justify-between sticky z-50">
      <div class=" ml-12 flex items-center h-16 w-3/5">
        <HeaderLogo />
        <HeaderMenu />
        <Searchbar />
      </div>

      <Show when={props.isAuthenticated} fallback={signInButton}>
        <UserMenuGroup />
      </Show>
    </header>
  );
};
