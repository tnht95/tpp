import { Show } from 'solid-js';

import { alienLogo } from '@/assets';
import { Searchbar } from '@/components';
import { UserMenuGroup } from '@/parts';

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
        <a href="/" class="mr-5 flex items-center justify-center">
          <img class="h-12" src={alienLogo} alt="logo" />
          <span class="ml-4 uppercase font-black text-sm">
            The Pixel
            <br />
            playground
          </span>
        </a>
        <nav class="contents font-semibold text-base ">
          <ul class="flex-1 flex items-center h-full mr-3">
            <li class="px-5 h-full flex items-center hover:bg-indigo-300 hover:text-indigo-900">
              <a href="/">
                <span>Home</span>
              </a>
            </li>
            <li class="px-5 h-full flex items-center hover:bg-indigo-300 hover:text-indigo-900 ">
              <a href="/games">
                <span>Games</span>
              </a>
            </li>
            <li class="p-5 xl:p-8 h-full flex items-center hover:bg-indigo-300 hover:text-indigo-900 ">
              <a href="/blogs">
                <span>Blog</span>
              </a>
            </li>
          </ul>
          <Searchbar />
        </nav>
      </div>

      <Show when={props.isAuthenticated} fallback={signInButton}>
        <UserMenuGroup />
      </Show>
    </header>
  );
};
