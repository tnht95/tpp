import { createSignal, Show } from 'solid-js';
import { ParentProps } from 'solid-js/types/render/component';

import { PreviewButtonGroup } from '@/components';

import { Markdown } from './markdown';

export const CommentForm = (props: ParentProps) => {
  const [isEditMode, setIsEditMode] = createSignal(true);
  const [content, setContent] = createSignal('');
  const displayMarkdown = (
    <div class="py-2 px-3 min-h-20 border border-white">
      <Markdown content={content()} />
    </div>
  );

  const handleClick = () => {
    setIsEditMode(mode => !mode);
  };

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
              class="bg-gray-100 rounded border border-gray-100 leading-normal resize-none w-full h-20 py-2 px-3 placeholder-gray-400 focus:border-gray-300 focus:outline-none focus:bg-white"
              name="body"
              placeholder="Type Your Comment (Support some markdowns)"
              required
              onFocusOut={e => setContent(e.target.value)}
              value={content()}
            />
          </Show>
          <div class="mt-2">
            <PreviewButtonGroup
              onClick={handleClick}
              isEditMode={isEditMode()}
            />
          </div>
        </div>
      </div>
    </form>
  );
};
