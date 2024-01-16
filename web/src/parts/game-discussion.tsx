import { Button, DiscussionForm, TableRow } from '@/components';

export const GameDiscussion = () => (
  <>
    <div class="flex flex-col ">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 ">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div class="overflow-hidden border border-gray-200 md:rounded-lg">
            <div class="min-w-full divide-y divide-gray-200">
              <div class="flex justify-between items-center py-3.5 px-8 text-base font-bold text-left rtl:text-right text-black">
                <p class="text-lg">Total 2 discussions</p>
                <Button
                  withIcon="fa-solid fa-plus"
                  title="New"
                  customStyle="hover:text-white hover:bg-green-500 float-right text-green-500 font-bold"
                  modalTargetId="discussion-modal"
                />
              </div>
              <DiscussionForm />
              <TableRow
                title="Found Bug"
                user="johnny@gmail.com"
                date="26 Jan 2022"
              />
              <TableRow
                title="Found Bug"
                user="johnny@gmail.com"
                date="26 Jan 2022"
              />
              <TableRow
                title="Found Bug"
                user="johnny@gmail.com"
                date="26 Jan 2022"
              />
              <TableRow
                title="Found Bug"
                user="johnny@gmail.com"
                date="26 Jan 2022"
              />
              <TableRow
                title="Found Bug"
                user="johnny@gmail.com"
                date="26 Jan 2022"
              />
              <TableRow
                title="Found Bug"
                user="johnny@gmail.com"
                date="26 Jan 2022"
              />
              <TableRow
                title="Found Bug"
                user="johnny@gmail.com"
                date="26 Jan 2022"
              />
              <TableRow
                title="Found Bug"
                user="johnny@gmail.com"
                date="26 Jan 2022"
              />
              <TableRow
                title="Found Bug"
                user="johnny@gmail.com"
                date="26 Jan 2022"
              />
            </div>
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
  </>
);
