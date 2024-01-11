import { Button } from '@/components';

export const GameDiscussion = () => (
  <section class="flex flex-col items-center mt-10">
    <div class="flex flex-col w-2/3">
      <div class="mb-3">
        <Button
          withIcon="fa-solid fa-plus"
          title="New"
          textColor="text-white"
          bgColor="bg-green-500"
          hoverEffect="hover:bg-white hover:text-green-500"
        />
      </div>

      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 ">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div class="overflow-hidden border border-gray-200 md:rounded-lg">
            <table class="min-w-full divide-y divide-gray-200 bg-gray-100">
              <thead>
                <tr>
                  <th
                    scope="col"
                    class="py-3.5 px-4 text-sm font-bold text-left rtl:text-right text-black  w-1/6"
                  >
                    Total: 2
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr class="hover:bg-gray-100 ">
                  <td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap ">
                    <div class="inline-flex items-center gap-x-3">
                      <span>#3066</span>
                    </div>
                  </td>

                  <td class="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                    <div>
                      <a href="" class="text-base font-bold text-gray-800  ">
                        Arthur Melo
                      </a>
                      <p class="text-xs font-normal text-gray-600 ">
                        Feb 24 2022 by authurmelo@example.com
                      </p>
                    </div>
                  </td>
                </tr>

                <tr class="hover:bg-gray-100 ">
                  <td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                    <div class="inline-flex items-center gap-x-3">
                      <span>#3065</span>
                    </div>
                  </td>

                  <td class="px-4 py-4 text-sm text-gray-500  whitespace-nowrap">
                    <div>
                      <a href="" class="text-base font-bold text-gray-800  ">
                        Andi Lane
                      </a>
                      <p class="text-xs font-normal text-gray-600 ">
                        Jan 15 2022 by andi@example.com
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between mt-6">
      <a
        href="#"
        class="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5 rtl:-scale-x-100"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
          />
        </svg>

        <span>previous</span>
      </a>

      <div class="items-center hidden md:flex gap-x-3">
        <a
          href="#"
          class="px-2 py-1 text-sm text-blue-500 rounded-md  bg-blue-100/60"
        >
          1
        </a>
        <a
          href="#"
          class="px-2 py-1 text-sm text-gray-500 rounded-md   hover:bg-gray-100"
        >
          2
        </a>
        <a
          href="#"
          class="px-2 py-1 text-sm text-gray-500 rounded-md   hover:bg-gray-100"
        >
          3
        </a>
        <a
          href="#"
          class="px-2 py-1 text-sm text-gray-500 rounded-md hover:bg-gray-100"
        >
          ...
        </a>
        <a
          href="#"
          class="px-2 py-1 text-sm text-gray-500 rounded-md  hover:bg-gray-100"
        >
          12
        </a>
        <a
          href="#"
          class="px-2 py-1 text-sm text-gray-500 rounded-md hover:bg-gray-100"
        >
          13
        </a>
        <a
          href="#"
          class="px-2 py-1 text-sm text-gray-500 rounded-md  hover:bg-gray-100"
        >
          14
        </a>
      </div>

      <a
        href="#"
        class="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 \0"
      >
        <span>Next</span>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5 rtl:-scale-x-100"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
          />
        </svg>
      </a>
    </div>
  </section>
);
