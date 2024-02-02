export const HeaderMenu = () => (
  <nav class="contents text-base font-semibold">
    <ul class="mr-3 flex h-full flex-1 items-center">
      <a class="h-full" href="/">
        <li class="flex h-full items-center px-5 hover:bg-indigo-300 hover:text-indigo-900">
          <span>Emulator</span>
        </li>
      </a>
      <a class="h-full" href="/games">
        <li class="flex h-full items-center px-5 hover:bg-indigo-300 hover:text-indigo-900">
          <span>Games</span>
        </li>
      </a>
      <a class="h-full" href="/blogs">
        <li class="flex h-full items-center p-5 hover:bg-indigo-300 hover:text-indigo-900 xl:p-8">
          <span>Blog</span>
        </li>
      </a>
    </ul>
  </nav>
);
