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
    <div class="p-3 h-60 overflow-auto border border-white">
      <Markdown content={content()} />
    </div>
  );

  const handleClick = () => {
    setIsEditMode(mode => !mode);
  };

  return (
    <div
      ref={props.modalRef}
      tabindex="-1"
      aria-hidden="true"
      class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 max-h-full "
    >
      <div class="relative p-6 w-1/2">
        <div class="relative bg-white rounded-xl shadow ">
          <div class="flex items-center justify-between p-6 rounded-t ">
            <div class=" text-center font-bold text-2xl text-gray-800 ml-1">
              New Post
            </div>

            <button
              type="button"
              class="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
              onClick={() => props.onCloseHandler()}
            >
              <i class="fa-solid fa-xmark text-lg" />
              <span class="sr-only">Close modal</span>
            </button>
          </div>
          <form action="#">
            <div class=" mx-auto flex flex-col text-gray-800 border-b rounded-b-xl border-gray-300 px-6 shadow-lg gap-7">
              <input
                class="placeholder-gray-400 border border-gray-300 p-3 rounded-xl outline-none"
                placeholder="Title"
                type="text"
              />
              <textarea
                class=" placeholder-gray-400 p-3 border rounded-xl border-gray-300 outline-none"
                placeholder="Describe shortly about this post here"
              />

              <Show when={isEditMode()} fallback={displayMarkdown}>
                <textarea
                  class="placeholder-gray-400 p-3 h-60 border rounded-xl border-gray-300 outline-none"
                  placeholder="Describe everything about this post here (Support some markdowns)"
                  onFocusOut={e => setContent(e.target.value)}
                  value={content()}
                />
              </Show>

              <div class="mb-10">
                <PreviewButtonGroup
                  isEditMode={isEditMode()}
                  onClick={handleClick}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
