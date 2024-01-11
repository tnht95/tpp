export const GameDetailsTabs = () => (
  <div class="px-6 mt-4 overflow-x-hidden lg:px-10">
    <div class="flex flex-row ">
      <div class="flex items-center flex-5">
        <i class="fa-solid fa-puzzle-piece text-indigo-900 text-xl mr-2" />
        <div class="text-2xl font-medium text-indigo-900 cursor-pointer hover:underline">
          tailwindcss
        </div>
      </div>
      <div class="flex flex-2 ">
        <div class="hidden  md:flex md:justify-between">
          <div class="flex text-center border rounded-lg md:border-none">
            <div class="flex items-center px-2 py-1 bg-gray-200 border-gray-400 cursor-pointer md:rounded-l-lg md:border-t md:border-l md:border-b hover:bg-gray-400">
              <i class="fa-solid fa-plus mr-1 text-sm" />
              <span class="self-center text-sm font-medium">Subscribe</span>
            </div>
            <div class="px-2 py-1 text-sm font-semibold border border-t border-gray-400 rounded-r-lg cursor-pointer hover:text-blue-600">
              423
            </div>
          </div>
          <div class="flex mx-4">
            <div class="flex group items-center px-2 py-1 bg-indigo-900 border-t border-b border-l border-gray-400 rounded-l-lg cursor-pointer hover:bg-gray-400">
              <i class="fa-solid fa-star text-yellow-400 mr-1 text-sm" />

              <span class="self-center group-hover:text-black text-sm text-white font-medium">
                Unstar
              </span>
            </div>
            <div class="px-2 py-1 text-sm font-semibold border border-t border-gray-400 rounded-r-lg cursor-pointer hover:text-blue-600">
              24.1k
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between px-10 mt-6 -mx-10 border-b select-none">
      <div class="flex">
        <div class="flex items-center px-4 pb-2 text-sm border-b-2 border-indigo-900 cursor-pointer">
          <i class="fa-solid fa-wand-sparkles mr-1" />
          Info
        </div>
        <div class="flex items-center hidden px-4 pb-2 text-sm border-b-2 border-transparent cursor-pointer hover:border-gray-300 md:flex md:block">
          <i class=" fa-regular fa-comment-dots mr-2" /> Discussions
        </div>
        <div class="flex items-center hidden px-4 pb-2 text-sm border-b-2 border-transparent cursor-pointer hover:border-gray-300 md:block md:flex">
          <i class="fa-regular fa-newspaper mr-2" />
          Activities
        </div>
      </div>
      <div class="flex items-start pb-2 cursor-pointer md:hidden">
        <svg
          class="w-5 h-5 text-gray-700 fill-current"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
      </div>
    </div>
  </div>
);
