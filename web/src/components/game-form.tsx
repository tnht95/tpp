import { createSignal, Ref, Show } from 'solid-js';

import { Markdown, PreviewButtonGroup } from '@/components';

type GameFormProps = {
  ref: Ref<HTMLDivElement>;
  onCloseHandler: () => void;
};

export const GameForm = (props: GameFormProps) => {
  const [isEditMode, setIsEditMode] = createSignal(true);
  const [content, setContent] = createSignal('');

  const displayMarkdown = (
    <div class="h-60 overflow-auto border border-white px-3 py-2">
      <Markdown content={content()} />
    </div>
  );

  const handleClick = () => {
    setIsEditMode(mode => !mode);
  };

  return (
    <div
      ref={props.ref}
      tabindex="-1"
      aria-hidden="true"
      class="fixed inset-x-0 top-0 z-50 hidden max-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden md:inset-0"
    >
      <div class="relative w-1/2">
        <div class="relative rounded-xl bg-white p-4 pb-10 shadow">
          <div class="flex items-center justify-between rounded-t p-6">
            <div class="ml-1 text-center text-2xl font-bold text-gray-700">
              Upload your game
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

          <form class="px-6">
            <div class="flex flex-col gap-5">
              <input
                placeholder="Game title"
                class="w-full rounded-xl border p-3 placeholder:text-gray-400"
              />
              <input
                placeholder="Game repo link"
                class="w-full rounded-xl border p-3 placeholder:text-gray-400"
              />
              <input
                placeholder="Game avatar link"
                class="w-full rounded-xl border p-3 placeholder:text-gray-400"
              />
              <input
                placeholder="Game tags: separate each tag with a comma"
                class="w-full rounded-xl border p-3 placeholder:text-gray-400"
              />
              <textarea
                name="postContent"
                rows="4"
                class="w-full resize-none rounded-xl border border-gray-200 py-2 transition duration-150 ease-in-out placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
                placeholder="About this game"
              />

              <Show when={isEditMode()} fallback={displayMarkdown}>
                <textarea
                  name="postContent"
                  rows="4"
                  class="h-60 w-full resize-none rounded-xl border border-gray-200 py-2 transition duration-150 ease-in-out placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
                  placeholder="Game discription (Support some markdowns)"
                  onFocusOut={e => setContent(e.target.value)}
                  value={content()}
                />
              </Show>
              <div class="mb-6">
                <div class="relative flex items-center justify-between rounded-xl border bg-white px-4 py-3 transition duration-150 ease-in-out hover:border-blue-500">
                  <input
                    type="file"
                    name="fileAttachment"
                    class="absolute inset-0 size-full cursor-pointer opacity-0"
                  />
                  <div class="flex items-center">
                    <i class="fa-solid fa-plus text-lg text-gray-400" />
                    <span class="ml-2 text-gray-400">Upload your ROM file</span>
                  </div>
                  <span class="text-sm text-gray-300">Max file size: 4KB</span>
                </div>
              </div>
            </div>
          </form>
          <PreviewButtonGroup
            onPreviewHandler={handleClick}
            onSubmitHandler={handleClick}
            isEditMode={isEditMode()}
          />
        </div>
      </div>
    </div>
  );
};
