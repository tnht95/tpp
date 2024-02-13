import { createEffect, createSignal, Show } from 'solid-js';
import { ParentProps } from 'solid-js/types/render/component';

import { Markdown, PreviewButtonGroup } from '@/components';

type CommentFormProps = {
  content?: string;
  onSubmit: (content: string) => void;
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
      props.onSubmit(content());
      setContent('');
    }
  };

  createEffect(() => {
    setContent(props.content || '');
  });

  return (
    <form
      class="flex flex-col gap-4 rounded-xl border p-10"
      onSubmit={onSubmitHandler}
    >
      <Show when={props.children}>
        <h2 class="text-xl font-bold text-gray-800">{props.children}</h2>
      </Show>
      <Show
        when={isEditMode()}
        fallback={
          <div class="min-h-20 border border-white px-3 py-2">
            <Markdown content={content()} />
          </div>
        }
      >
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
    </form>
  );
};
