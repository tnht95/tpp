import { Avatar, Tag } from '@/components';

export const GameDetailsSidebar = () => (
  <div class="ml-4 md:w-1/4">
    <div class="hidden md:block">
      <p class="text-base font-semibold text-black">About</p>
      <div class="mt-4 border-b pb-2">
        <span class="text-sm lg:text-base">
          A utility-first CSS framework for rapid UI development.
        </span>
        <div class="my-4">
          <a
            class="mb-2 flex items-center text-base font-semibold text-blue-600 hover:text-blue-400"
            href="#"
          >
            <i class="fa-solid fa-link mr-2" />
            github.com/tailwindcss
          </a>
        </div>
      </div>
    </div>
    <div class="-mx-10 border-b p-6 md:mx-0 md:px-0">
      <p class="mb-5 text-base font-semibold text-black">Upload By</p>
      <Avatar />
    </div>
    <div class="my-4 flex flex-col flex-wrap gap-2">
      <p class="mb-3 text-base font-semibold text-black">Tag</p>
      <div class="flex flex-wrap gap-2">
        <Tag name="Name" />
        <Tag name="Name" />
        <Tag name="Name" />
      </div>
    </div>
  </div>
);
