import { Dropdown } from 'flowbite';
import { createEffect, createSignal } from 'solid-js';

export const Searchbar = () => {
  const [btnRef, setBtnRef] = createSignal<HTMLButtonElement>();
  const [dropdownRef, setdropdownRef] = createSignal<HTMLDivElement>();

  createEffect(() => {
    new Dropdown(dropdownRef(), btnRef());
  });

  return (
    <form class="w-3/5">
      <div class="flex">
        <label
          for="search-dropdown"
          class="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Your Email
        </label>
        <button
          class="z-10 inline-flex shrink-0 items-center rounded-s-lg border border-white bg-indigo-900 px-4 py-2.5 text-center text-sm font-medium text-white hover:border-r-indigo-900 hover:bg-white hover:text-indigo-900 focus:outline-none"
          type="button"
          ref={setBtnRef}
        >
          All categories <i class="fa-solid fa-angle-down ml-2" />
        </button>
        <div
          class="!top-0.5 z-10 hidden w-36 divide-y divide-gray-100 rounded-lg bg-white shadow"
          ref={setdropdownRef}
        >
          <ul class="text-sm text-indigo-900" aria-labelledby="dropdown-button">
            <li>
              <button
                type="button"
                class="inline-flex w-full rounded-t-lg px-4 py-2 hover:bg-indigo-900 hover:text-white"
              >
                Games
              </button>
            </li>
            <li>
              <button
                type="button"
                class="inline-flex w-full px-4 py-2 hover:bg-indigo-900 hover:text-white"
              >
                Blogs
              </button>
            </li>
            <li>
              <button
                type="button"
                class="inline-flex w-full px-4 py-2 hover:bg-indigo-900 hover:text-white"
              >
                Users
              </button>
            </li>
            <li>
              <button
                type="button"
                class="inline-flex w-full rounded-b-lg px-4 py-2 hover:bg-indigo-900 hover:text-white"
              >
                Posts
              </button>
            </li>
          </ul>
        </div>
        <div class="relative w-full">
          <input
            class="z-20 block w-full rounded-e-lg border border-s-2 border-gray-300 border-s-gray-50 bg-gray-50 p-2.5 text-sm text-gray-900"
            placeholder="Search Games, Blogs, Posts, Users..."
            required
          />
        </div>
      </div>
    </form>
  );
};
