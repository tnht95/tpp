import { createEffect, createSignal, Show } from 'solid-js';
import { ParentProps } from 'solid-js/types/render/component';

import { PreviewButtonGroup } from '@/components';

import { Markdown } from './markdown';

type CommentFormProps = {
  content?: string;
  onSubmitHandler: (content: string) => void;
} & ParentProps;

const checkErr = (content: string): string => {
  const inputLen = content.length;
  switch (true) {
    case inputLen < 1: {
      return "Input can't be empty!";
    }
    case inputLen > 200: {
      return "Input can't be longer than 200 characters!";
    }
    default: {
      return '';
    }
  }
};

export const CommentForm = (props: CommentFormProps) => {
  const [content, setContent] = createSignal('');
  const [isEditMode, setIsEditMode] = createSignal(true);
  const [errMsg, setErrMsg] = createSignal('');

  const onSubmitHandler = (e: Event) => {
    e.preventDefault();
    setErrMsg(checkErr(content()));
    if (!errMsg()) {
      props.onSubmitHandler(content());
      setContent('');
    }
  };

  createEffect(() => {
    setContent(props.content || '');
  });

  return (
    <form
      class="w-full rounded-lg border bg-white px-7 py-4"
      onSubmit={onSubmitHandler}
    >
      <div class="flex flex-col gap-4">
        <h2 class="text-xl font-bold text-gray-800">{props.children}</h2>
        <div class="flex flex-1 flex-col gap-4">
          <Show when={isEditMode()} fallback={displayMarkdown(content())}>
            <textarea
              class="h-20 w-full resize-none rounded border border-gray-100 bg-gray-100 leading-normal placeholder:text-gray-400 focus:border-gray-300 focus:bg-white focus:outline-none"
              classList={{ 'border-red-600': !!errMsg() }}
              name="body"
              placeholder="Type Your Comment (Support some markdowns)"
              onFocusOut={e => setContent(e.target.value)}
              onFocusIn={() => setErrMsg('')}
              value={content()}
            />
          </Show>
          <div class="h-4">
            <Show when={errMsg()}>
              <p class="text-red-600">{errMsg()}</p>
            </Show>
          </div>
          <PreviewButtonGroup
            isEditMode={isEditMode()}
            onPreviewHandler={() => setIsEditMode(mode => !mode)}
          />
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
