import { Avatar, Tag } from '@/components';

export const GameDetailsSidebar = () => (
  <div class="ml-4 md:w-1/4">
    <div class="hidden md:block">
      <p class="text-base font-semibold text-black">About</p>
      <div class="pb-2 mt-4 border-b">
        <span class="text-sm lg:text-base">
          A utility-first CSS framework for rapid UI development.
        </span>
        <div class="my-4 fl">
          <a
            class="flex items-center mb-2 text-base font-semibold text-blue-600 hover:text-blue-400"
            href="#"
          >
            <i class="fa-solid fa-link mr-2" />
            github.com/tailwindcss
          </a>
        </div>
      </div>
    </div>
    <div class="px-6 py-6 -mx-10 border-b md:mx-0 md:px-0">
      <p class="text-base font-semibold text-black mb-5">Upload By</p>
      <Avatar />
    </div>
    <div class="flex flex-col flex-wrap gap-2 my-4">
      <p class="text-base font-semibold text-black mb-3">Tag</p>
      <div class="flex flex-wrap gap-2">
        <Tag name="Name" />
        <Tag name="Name" />
        <Tag name="Name" />
      </div>
    </div>
  </div>
);
