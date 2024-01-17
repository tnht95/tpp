import { createSignal, Show } from 'solid-js';
import { ParentProps } from 'solid-js/types/render/component';

import { Markdown } from './markdown';

export const CommentForm = (props: ParentProps) => {
  const [isEditMode, setIsEditMode] = createSignal(true);
  const [content, setContent] = createSignal('');
  const displayMarkdown = (
    <div class="p-2">
      <Markdown content={content()} />
    </div>
  );

  return (
    <form class="w-full border bg-white rounded-lg px-4 pt-2">
      <div class="flex flex-wrap -mx-3 mb-6">
        <div>
          <h2 class="px-4 pt-3 pb-2 font-bold text-gray-800 text-xl">
            {props.children}
          </h2>
        </div>
        <div class="w-full md:w-full px-3 mb-2 mt-2">
          <Show when={isEditMode()} fallback={displayMarkdown}>
            <textarea
              class="bg-gray-100 rounded border border-gray-100 leading-normal resize-none w-full h-20 py-2 px-3  placeholder-gray-400 focus:border-gray-300 focus:outline-none focus:bg-white"
              name="body"
              placeholder="Type Your Comment"
              required
              onFocusOut={e => setContent(e.target.value)}
              value={content()}
            />
          </Show>
        </div>
        <div class="w-full md:w-full flex items-start px-3">
          <div class="flex items-start w-1/2 text-gray-700 px-2 mr-auto" />
          <div class="-mr-1">
            <button
              type="button"
              class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              onClick={() => setIsEditMode(mode => !mode)}
            >
              {isEditMode() ? 'Preview' : 'Edit'}
            </button>
            <button
              type="button"
              class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
