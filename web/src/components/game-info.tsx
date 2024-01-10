import { Tag } from '@/components';

export const GameInfo = () => (
  <div class="container pb-10  mt-8">
    <div class="md:flex">
      <div class="w-full mr-4 md:w-3/4">
        <div class="py-6 border-b md:border md:rounded-lg md:px-8">
          <div class="font-semibold text-black">README.md</div>
          <div class="my-6">
            <img
              class="w-64"
              src="https://camo.githubusercontent.com/87d7034892fd41dc88f3606bb44b853f87cd2c51/68747470733a2f2f7265666163746f72696e6775692e6e7963332e63646e2e6469676974616c6f6365616e7370616365732e636f6d2f7461696c77696e642d6c6f676f2e737667"
              alt=""
            />
            <p>
              A utility-first CSS framework for rapidly building custom user
              interfaces.{' '}
            </p>
            <div class="flex">
              <div class="flex mr-2 items-center my-4">
                <div class="flex items-center px-2 leading-none py-1 text-white bg-gray-800 rounded-l-md cursor-pointer">
                  <span class="self-center text-xs font-medium">build</span>
                </div>
                <div class="px-2 text-xs font-semibold text-white leading-none py-1 bg-green-500 rounded-r-md cursor-pointer">
                  passing
                </div>
              </div>
              <div class="flex mr-2 items-center my-4">
                <div class="flex items-center px-2 leading-none py-1 text-white bg-gray-800 rounded-l-md cursor-pointer">
                  <span class="self-center text-xs font-medium">downloads</span>
                </div>
                <div class="px-2 text-xs font-semibold text-white leading-none py-1 bg-green-500 rounded-r-md cursor-pointer">
                  8.7M
                </div>
              </div>
            </div>
            <hr />
          </div>
          <div class="mb-6">
            <div class="flex items-center pb-2 -mx-4 text-lg font-bold leading-normal text-transparent hover:text-gray-700">
              <svg
                class="w-4 h-4 mr-1 cursor-pointer"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <p class="text-black">Documentation</p>
            </div>
            <hr />
            <div class="my-4">
              For full documentation, visit{' '}
              <a href="#" class="text-blue-600 hover:underline">
                tailwindcss.com
              </a>
            </div>
          </div>
          <div class="mb-6">
            <div class="flex items-center pb-2 -mx-4 text-lg font-bold leading-normal text-transparent hover:text-gray-700">
              <svg
                class="w-4 h-4 mr-1 cursor-pointer"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <p class="text-black">Community</p>
            </div>
            <hr />
            <div class="my-4">
              For help, discussion about best practices, or any other
              conversation that would benefit from being searchable:
            </div>
            <a href="#" class="my-4 text-blue-600 hover:underline">
              Discuss Tailwind CSS on GitHub
            </a>
            <div class="my-4">
              For casual chit-chat with others using the framework:
            </div>
            <a href="#" class="my-4 text-blue-600 hover:underline">
              Join the Tailwind CSS Discord Server
            </a>
          </div>
          <div class="mb-6">
            <div class="flex items-center pb-2 -mx-4 text-lg font-bold leading-normal text-transparent hover:text-gray-700">
              <svg
                class="w-4 h-4 mr-1 cursor-pointer"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <p class="text-black">Contributing</p>
            </div>
            <hr />
            <div class="my-4">
              If you're interested in contributing to Tailwind CSS, please read
              our{' '}
              <a href="#" class="text-blue-600 hover:underline">
                contributing docs
              </a>{' '}
              <span class="font-semibold text-black">
                before submitting a pull request.
              </span>
            </div>
          </div>
        </div>
      </div>
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
              <div class="flex flex-wrap gap-2 my-4">
                <p class="text-base font-semibold text-black">Tag</p>
                <div class="flex flex-wrap gap-2">
                  <Tag />
                  <Tag />
                  <Tag />
                  <Tag />
                  <Tag />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="px-6 py-6 -mx-10 border-b md:mx-0 md:px-0">
          <p class="text-base font-semibold text-black">Upload By</p>
          <div class="flex flex-wrap items-center mt-4 -mx-2 overflow-hidden">
            <img
              class="object-cover w-10 h-10 mx-2 mt-2 text-white border-2 border-gray-400 rounded-full shadow-sm cursor-pointer md:mt-0"
              src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);
