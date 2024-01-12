import { Button } from '@/components';

export const CommentForm = () => (
  <form class=" border bg-white rounded-lg px-4 pt-2">
    <div class="flex flex-wrap -mx-3 mb-6">
      <h2 class="px-4 pt-3 pb-2 font-semibold text-gray-800 text-lg">
        Add a new comment
      </h2>
      <div class="w-full md:w-full px-3 mb-2 mt-2">
        <textarea
          class="bg-gray-100 rounded border border-gray-100 leading-normal resize-none w-full h-20 py-2 px-3  placeholder-gray-400 focus:border-gray-300 focus:outline-none focus:bg-white"
          name="body"
          placeholder="Type Your Comment"
          required
        />
      </div>
      <div class="w-full md:w-full flex items-start px-3">
        <div class="flex items-start w-1/2 text-gray-700 px-2 mr-auto">
          <svg
            fill="none"
            class="w-5 h-5 text-gray-600 mr-1"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p class="text-xs md:text-sm pt-px">Some HTML is okay.</p>
        </div>
        <div class="-mr-1">
          <Button
            title="Post Comment"
            customStyle="hover:bg-indigo-900 hover:text-white font-semibold"
          />
        </div>
      </div>
    </div>
  </form>
);
