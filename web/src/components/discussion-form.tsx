import { createSignal, Ref, Show } from 'solid-js';

import { Markdown, PreviewButtonGroup } from '@/components';
import { useGameCtx } from '@/context';
import { AddDiscussion } from '@/models';
import { MaxStr, MinStr, useForm } from '@/utils';

type DiscussionFormProps = {
  ref: Ref<HTMLDivElement>;
  onCloseHandler: () => void;
  onSubmitHandler: (discussion: AddDiscussion) => void;
};

const ErrorMessage = (props: { msg: string }) => (
  <span class="text-red-600">{props.msg}</span>
);

export const DiscussionForm = (props: DiscussionFormProps) => {
  const {
    game: { data }
  } = useGameCtx();
  const [isEditMode, setIsEditMode] = createSignal(true);
  const [content, setContent] = createSignal('');
  const { validate, submit, errors } = useForm({ errClass: 'border-red-600' });

  const displayMarkdown = (
    <div class="h-60 overflow-auto border border-white p-3">
      <Markdown content={content()} />
    </div>
  );

  const handleClick = () => {
    setIsEditMode(mode => !mode);
  };

  const onSubmitHandler = (formEl: HTMLFormElement) => {
    const formData = new FormData(formEl);
    props.onSubmitHandler({
      gameId: data()?.id as string,
      title: formData.get('title') as string,
      content: formData.get('content') as string
    });
    formEl.reset();
  };

  return (
    <div
      ref={props.ref}
      tabindex="-1"
      aria-hidden="true"
      class="fixed inset-x-0 top-0 z-50 hidden max-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden md:inset-0"
    >
      <div class="relative w-1/2 p-6">
        <div class="relative rounded-xl bg-white shadow">
          <div class="flex items-center justify-between rounded-t p-6">
            <div class="ml-1 text-center text-2xl font-bold text-gray-800">
              New Discussion
            </div>

            <button
              type="button"
              class="end-2.5 ms-auto inline-flex size-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900"
              onClick={() => props.onCloseHandler()}
            >
              <i class="fa-solid fa-xmark text-lg" />
              <span class="sr-only">Close modal</span>
            </button>
          </div>
          <form ref={el => [submit(el, () => onSubmitHandler)]}>
            <div class="mx-auto flex flex-col gap-3 rounded-b-xl border-b border-gray-300 px-6 text-gray-800 shadow-lg">
              <input
                class="rounded-xl border border-gray-300 p-3 outline-none placeholder:text-gray-400"
                placeholder="Discussion title"
                type="text"
                name="title"
                ref={el => [
                  validate(el, () => [MinStr(1, 'Required'), MaxStr(100)])
                ]}
              />
              {errors['title'] && <ErrorMessage msg={errors['title']} />}
              <Show when={isEditMode()} fallback={displayMarkdown}>
                <textarea
                  class="h-60 rounded-xl border border-gray-300 p-3 outline-none placeholder:text-gray-400"
                  placeholder="What do you want to discuss about? (Support some markdowns)"
                  onFocusOut={e => setContent(e.target.value)}
                  value={content()}
                  name="content"
                  ref={el => [
                    validate(el, () => [MinStr(1, 'Required'), MaxStr(1000)])
                  ]}
                />
                {errors['content'] && <ErrorMessage msg={errors['content']} />}
              </Show>
              <div class="mb-5">
                <PreviewButtonGroup
                  isEditMode={isEditMode()}
                  onPreviewHandler={handleClick}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
