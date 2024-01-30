import { createSignal, Ref, Show } from 'solid-js';

import { Markdown, PreviewButtonGroup } from '@/components';

type BlogFormProps = {
  modalRef: Ref<HTMLDivElement>;
  onCloseHandler: () => void;
};

export const BlogForm = (props: BlogFormProps) => {
  const [isEditMode, setIsEditMode] = createSignal(true);
  const [content, setContent] = createSignal('');
  const displayMarkdown = (
    <div class="h-60 overflow-auto border border-white p-3">
      <Markdown content={content()} />
    </div>
  );

  const handleClick = () => {
    setIsEditMode(mode => !mode);
  };
  // const onSubmitHandler = (e: Event) => {
  //   e.preventDefault();
  //   props.onSubmitHandler(content());
  //   props.onCloseHandler();
  //   setContent('');
  // };
  return (
    <div
      ref={props.modalRef}
      tabindex="-1"
      aria-hidden="true"
      class="fixed inset-x-0 top-0 z-50 hidden max-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden md:inset-0"
    >
      <div class="relative w-1/2 p-6">
        <div class="relative rounded-xl bg-white shadow">
          <div class="flex items-center justify-between rounded-t p-6">
            <div class="ml-1 text-center text-2xl font-bold text-gray-800">
              New Post
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
          <form>
            <div class="mx-auto flex flex-col gap-7 rounded-b-xl border-b border-gray-300 px-6 text-gray-800 shadow-lg">
              <input
                class="rounded-xl border border-gray-300 p-3 outline-none placeholder:text-gray-400"
                placeholder="Title"
                type="text"
              />
              <textarea
                class="rounded-xl border border-gray-300 p-3 outline-none placeholder:text-gray-400"
                placeholder="Describe shortly about this post here"
              />
              <input
                placeholder="Blog tags: separate each tag with a comma"
                class="w-full rounded-xl border p-3 placeholder:text-gray-400"
              />

              <Show when={isEditMode()} fallback={displayMarkdown}>
                <textarea
                  class="h-60 rounded-xl border border-gray-300 p-3 outline-none placeholder:text-gray-400"
                  placeholder="Describe everything about this post here (Support some markdowns)"
                  onFocusOut={e => setContent(e.target.value)}
                  value={content()}
                />
              </Show>

              <div class="mb-10">
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
