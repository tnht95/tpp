import { createSignal, Ref, Show } from 'solid-js';

import { Markdown, PreviewButtonGroup } from '@/components';
import { AddGame } from '@/models';
import { MinStr, useForm, validateTags } from '@/utils';

type GameFormProps = {
  ref: Ref<HTMLDivElement>;
  onCloseHandler: () => void;
  onSubmitHandler: (file: File, game: AddGame) => void;
};

const ErrorMessage = (props: { msg: string }) => (
  <span class="text-red-600">{props.msg}</span>
);

export const GameForm = (props: GameFormProps) => {
  const [isEditMode, setIsEditMode] = createSignal(true);
  const [content, setContent] = createSignal('');
  const { validate, submit, errors } = useForm({ errClass: 'border-red-600' });

  const displayMarkdown = (
    <div class="h-60 overflow-auto border border-white px-3 py-2">
      <Markdown content={content()} />
    </div>
  );

  const togglePreviewHandler = () => {
    setIsEditMode(mode => !mode);
  };

  const onSubmitHandler = (formEl: HTMLFormElement) => {
    const formData = new FormData(formEl);
    props.onSubmitHandler(formData.get('rom') as File, {
      name: formData.get('name') as string,
      url: formData.get('url') as string,
      avatarUrl: formData.get('avatarUrl') as string,
      about: formData.get('about') as string,
      info: formData.get('info') as string,
      tags: getTagValue(formData.get('tags') as string)
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
          <form ref={el => [submit(el, () => onSubmitHandler)]} class="px-6">
            <div class="flex flex-col gap-5">
              <input
                placeholder="Game name"
                class="w-full rounded-xl border p-3 placeholder:text-gray-400"
                ref={el => [validate(el, () => [MinStr(1, 'Required')])]}
                name="name"
              />
              {errors['name'] && <ErrorMessage msg={errors['name']} />}
              <input
                placeholder="Game url"
                class="w-full rounded-xl border p-3 placeholder:text-gray-400"
                name="url"
              />
              <input
                placeholder="Game avatar url"
                class="w-full rounded-xl border p-3 placeholder:text-gray-400"
                name="avatarUrl"
              />
              <input
                placeholder="Game tags: separate each tag with a comma"
                class="w-full rounded-xl border p-3 placeholder:text-gray-400"
                name="tags"
                ref={el => [validate(el, () => [validateTags])]}
              />
              {errors['tags'] && <ErrorMessage msg={errors['tags']} />}
              <textarea
                name="about"
                rows="4"
                class="w-full resize-none rounded-xl border border-gray-200 py-2 transition duration-150 ease-in-out placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
                placeholder="About this game"
              />
              <Show when={isEditMode()} fallback={displayMarkdown}>
                <textarea
                  name="info"
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
                    name="rom"
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
            <PreviewButtonGroup
              onPreviewHandler={togglePreviewHandler}
              isEditMode={isEditMode()}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

const getTagValue = (tags: string): string[] | undefined => {
  if (tags === '') return undefined;
  return tags.split(',');
};
