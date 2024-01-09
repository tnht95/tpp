import { createSignal } from 'solid-js';

import logo from '../assets/alien-logo.png';

export const Header = () => (
  <header class="bg-indigo-900 text-white shadow-lg">
    <div class=" mx-12 flex items-center h-16">
      <a href="" class="flex items-center justify-center">
        <img class="h-12" src={logo} alt="logo" />
        <span class="ml-4 uppercase font-black text-sm">The Pixel<br />playground</span>
      </a>
      <nav class="contents font-semibold text-base ">
        <ul class="flex-1 flex items-center">
          <li class="px-5">
            <a href="">
              <span>Home</span>
            </a>
          </li>
          <li class="px-5">
            <a href="">
              <span>Games</span>
            </a>
          </li>
          <li class="p-5 xl:p-8">
            <a href="">
              <span>Blog</span>
            </a>
          </li>
        </ul>
      </nav>
      <button class="border border-white rounded-full font-bold px-8 py-2  hover:bg-white hover:text-indigo-900">Sign In</button>
    </div>
  </header>
);
