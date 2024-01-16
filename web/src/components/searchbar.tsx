export const Searchbar = () => (
  <form class="w-3/5">
    <div class="flex">
      <label
        for="search-dropdown"
        class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
      >
        Your Email
      </label>
      <button
        id="dropdown-button"
        data-dropdown-toggle="dropdown"
        class="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm  font-medium text-center text-white bg-indigo-900 border border-white rounded-s-lg hover:bg-white hover:text-indigo-900 hover:border-r-indigo-900 focus:outline-none  "
        type="button"
      >
        All categories <i class="fa-solid fa-angle-down ml-2" />
      </button>
      <div
        id="dropdown"
        class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-36 "
      >
        <ul class="text-sm text-indigo-900 " aria-labelledby="dropdown-button">
          <li>
            <button
              type="button"
              class="inline-flex w-full px-4 py-2 hover:bg-indigo-900 hover:text-white rounded-t-lg"
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
              class="inline-flex w-full px-4 py-2 hover:bg-indigo-900 hover:text-white rounded-b-lg"
            >
              Posts
            </button>
          </li>
        </ul>
      </div>
      <div class="relative w-full">
        <input
          id="search-dropdown"
          class="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 "
          placeholder="Search Games, Blogs, Posts, Users..."
          required
        />
      </div>
    </div>
  </form>
);
