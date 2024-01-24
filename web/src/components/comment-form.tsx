import { createSignal, Show } from 'solid-js';
import { ParentProps } from 'solid-js/types/render/component';

import { PreviewButtonGroup } from '@/components';

import { Markdown } from './markdown';

type CommentFormProps = {
  onSubmitHandler?: (content: string) => void;
} & ParentProps;

export const CommentForm = (props: CommentFormProps) => {
  const [isEditMode, setIsEditMode] = createSignal(true);
  const [content, setContent] = createSignal('');

  return (
    <form class="w-full rounded-lg border bg-white px-4 pt-2">
      <div class="-mx-3 mb-6 flex flex-wrap">
        <div>
          <h2 class="px-4 pb-2 pt-3 text-xl font-bold text-gray-800">
            {props.children}
          </h2>
        </div>
        <div class="my-2 w-full px-3 md:w-full">
          <Show when={isEditMode()} fallback={displayMarkdown(content())}>
            <textarea
              class="h-20 w-full resize-none rounded border border-gray-100 bg-gray-100 px-3 py-2 leading-normal placeholder:text-gray-400 focus:border-gray-300 focus:bg-white focus:outline-none"
              name="body"
              placeholder="Type Your Comment (Support some markdowns)"
              required
              onFocusOut={e => setContent(e.target.value)}
              value={content()}
            />
          </Show>
          <div class="mt-2">
            <PreviewButtonGroup
              isEditMode={isEditMode()}
              onPreviewHandler={() => setIsEditMode(mode => !mode)}
              onSubmitHandler={() => {
                props.onSubmitHandler && props.onSubmitHandler(content());
                setContent('');
              }}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

const displayMarkdown = (content: string) => (
  <div class="min-h-20 border border-white px-3 py-2">
    <Markdown content={content} />
  </div>
);
