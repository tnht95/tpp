import { alienLogo } from '@/assets';
import { Searchbar } from '@/components';

export const Header = () => (
  <header class=" bg-indigo-900 text-white shadow-lg flex flex-row items-center justify-between">
    <div class=" ml-12 flex items-center h-16">
      <a href="" class="mr-5 flex items-center justify-center">
        <img class="h-12" src={alienLogo} alt="logo" />
        <span class="ml-4 uppercase font-black text-sm">
          The Pixel
          <br />
          playground
        </span>
      </a>
      <nav class="contents font-semibold text-base ">
        <ul class="flex-1 flex items-center h-full">
          <li class="px-5 h-full flex items-center hover:bg-indigo-300 hover:text-indigo-900 cursor-pointer">
            <a href="">
              <span>Home</span>
            </a>
          </li>
          <li class="px-5 h-full flex items-center hover:bg-indigo-300 hover:text-indigo-900 cursor-pointer">
            <a href="">
              <span>Games</span>
            </a>
          </li>
          <li class="p-5 xl:p-8 h-full flex items-center hover:bg-indigo-300 hover:text-indigo-900 cursor-pointer">
            <a href="">
              <span>Blog</span>
            </a>
          </li>
        </ul>
        <Searchbar />
      </nav>
    </div>

    <button class="border border-white rounded-full font-bold px-8 py-2  hover:bg-white hover:text-indigo-900 mr-12">
      Sign In
    </button>
  </header>
);
