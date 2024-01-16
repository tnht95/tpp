export const HeaderMenu = () => (
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
  </nav>
);
