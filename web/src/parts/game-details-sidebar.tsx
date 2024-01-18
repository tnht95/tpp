import { Avatar, Tag } from '@/components';

export const GameDetailsSidebar = () => (
  <div class="ml-4 md:w-1/4">
    <div class="hidden md:block">
      <p class="text-base font-semibold text-black">About</p>
      <div class="pb-2 mt-4 border-b">
        <span class="text-sm lg:text-base">
          A utility-first CSS framework for rapid UI development.
        </span>
        <div class="my-4">
          <a
            class="flex items-center mb-2 text-base font-semibold text-blue-600 hover:underline"
            href="#"
          >
            <svg
              class="w-4 h-4 mr-2 text-gray-700"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
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
