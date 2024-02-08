import { useNavigate } from '@solidjs/router';
import { Dropdown } from 'flowbite';
import { createEffect, createSignal } from 'solid-js';

export const Searchbar = () => {
  const [btnRef, setBtnRef] = createSignal<HTMLButtonElement>();
  const [dropdownRef, setDropdownRef] = createSignal<HTMLDivElement>();
  const [dropdown, setDropdown] = createSignal<Dropdown>();
  const [searchContent, setSearchContent] = createSignal('');
  const [searchCategory, setSearchCategory] = createSignal('');
  const navigate = useNavigate();

  createEffect(() => {
    setDropdown(new Dropdown(dropdownRef(), btnRef()));
  });

  const onSubmitHandler = (e: Event) => {
    e.preventDefault();
    if (searchContent()) {
      let url = `/search?keyword=${searchContent()}`;
      if (searchCategory()) {
        url = `${url}&category=${searchCategory()}`;
      }
      navigate(url);
      (e.target as HTMLFormElement).reset();
    }
  };

  return (
    <form onSubmit={onSubmitHandler} class="w-3/5">
      <div class="flex">
        <label
          for="search-dropdown"
          class="sr-only mb-2 text-sm font-medium text-gray-900"
        >
          Your Email
        </label>
        <button
          class="z-10 inline-flex w-40 shrink-0 items-center justify-between rounded-s-lg border border-white bg-indigo-900 px-4 py-2.5 text-center text-sm font-medium capitalize text-white hover:border-r-indigo-900 hover:bg-white hover:text-indigo-900 focus:outline-none"
          type="button"
          ref={setBtnRef}
        >
          {searchCategory() || 'All categories'}
          <i class="fa-solid fa-angle-down ml-2" />
        </button>
        <div
          class="!top-0.5 z-10 hidden w-36 divide-y divide-gray-100 rounded-lg bg-white shadow"
          ref={setDropdownRef}
        >
          <ul class="text-sm text-indigo-900" aria-labelledby="dropdown-button">
            <li>
              <button
                type="button"
                class="inline-flex w-full rounded-t-lg px-4 py-2 hover:bg-indigo-900 hover:text-white"
                onClick={() => {
                  setSearchCategory('');
                  dropdown()?.hide();
                }}
              >
                All categories
              </button>
            </li>
            <li>
              <button
                type="button"
                class="inline-flex w-full rounded-t-lg px-4 py-2 hover:bg-indigo-900 hover:text-white"
                onClick={() => {
                  setSearchCategory('games');
                  dropdown()?.hide();
                }}
              >
                Games
              </button>
            </li>
            <li>
              <button
                type="button"
                class="inline-flex w-full px-4 py-2 hover:bg-indigo-900 hover:text-white"
                onClick={() => {
                  setSearchCategory('users');
                  dropdown()?.hide();
                }}
              >
                Users
              </button>
            </li>
            <li>
              <button
                type="button"
                class="inline-flex w-full rounded-b-lg px-4 py-2 hover:bg-indigo-900 hover:text-white"
                onClick={() => {
                  setSearchCategory('posts');
                  dropdown()?.hide();
                }}
              >
                Posts
              </button>
            </li>
            <li>
              <button
                type="button"
                class="inline-flex w-full px-4 py-2 hover:bg-indigo-900 hover:text-white"
                onClick={() => {
                  setSearchCategory('blogs');
                  dropdown()?.hide();
                }}
              >
                Blogs
              </button>
            </li>
          </ul>
        </div>
        <div class="relative w-full">
          <input
            class="z-20 block w-full rounded-e-lg border border-s-2 border-gray-300 border-s-gray-50 bg-gray-50 p-2.5 text-sm text-gray-900"
            placeholder="Search Games, Blogs, Posts, Users..."
            onInput={e => setSearchContent(e.target.value.trim())}
            value={searchContent()}
            name="searchContent"
            maxLength={35}
          />
        </div>
      </div>
    </form>
  );
};
