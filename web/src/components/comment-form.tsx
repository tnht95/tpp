import { Button } from '@/components';

export const CommentForm = () => (
  <form class="w-full border bg-white rounded-lg px-4 pt-2">
    <div class="flex flex-wrap -mx-3 mb-6">
      <div>
        <h2 class="px-4 pt-3 pb-2 font-semibold text-gray-800 text-lg">
          Add a comment
        </h2>
      </div>
      <div class="w-full md:w-full px-3 mb-2 mt-2">
        <textarea
          class="bg-gray-100 rounded border border-gray-100 leading-normal resize-none w-full h-20 py-2 px-3  placeholder-gray-400 focus:border-gray-300 focus:outline-none focus:bg-white"
          name="body"
          placeholder="Type Your Comment"
          required
        />
      </div>
      <div class="w-full md:w-full flex items-start px-3">
        <div class="flex items-start w-1/2 text-gray-700 px-2 mr-auto" />
        <div class="-mr-1">
          <Button
            title="Post"
            customStyle="hover:bg-indigo-900 hover:text-white font-semibold"
          />
        </div>
      </div>
    </div>
  </form>
);
