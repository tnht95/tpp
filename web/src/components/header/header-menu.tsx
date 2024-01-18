export const HeaderMenu = () => (
  <nav class="contents text-base font-semibold">
    <ul class="mr-3 flex h-full flex-1 items-center">
      <li class="flex h-full items-center px-5 hover:bg-indigo-300 hover:text-indigo-900">
        <a href="/">
          <span>Emulator</span>
        </a>
      </li>
      <li class="flex h-full items-center px-5 hover:bg-indigo-300 hover:text-indigo-900">
        <a href="/games">
          <span>Games</span>
        </a>
      </li>
      <li class="flex h-full items-center p-5 hover:bg-indigo-300 hover:text-indigo-900 xl:p-8">
        <a href="/blogs">
          <span>Blog</span>
        </a>
      </li>
    </ul>
  </nav>
);
