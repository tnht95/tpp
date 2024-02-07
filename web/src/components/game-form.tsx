import { createEffect, createSignal, Ref, Show } from 'solid-js';

import { Markdown, PreviewButtonGroup } from '@/components';
import { Game, GameRequest } from '@/models';
import {
  fileRequired,
  getStrVal,
  getTagValue,
  MaxStr,
  MinStr,
  useForm,
  validateTags
} from '@/utils';

type GameFormProps = {
  ref: Ref<HTMLDivElement>;
  onCloseHandler: () => void;
  onSubmitHandler: (file: File, game: GameRequest) => void;
  game?: Game | undefined;
};

const ErrorMessage = (props: { msg: string }) => (
  <span class="text-red-600">{props.msg}</span>
);

export const GameForm = (props: GameFormProps) => {
  const [isEditMode, setIsEditMode] = createSignal(true);
  const [isFileUploaderVisible, setIsFileUploaderVisible] = createSignal(false);
  const [content, setContent] = createSignal('');
  const { validate, submit, errors } = useForm({ errClass: 'border-red-600' });

  createEffect(() => {
    setContent(props.game?.info ?? '');
  });

  const togglePreviewHandler = () => {
    setIsEditMode(mode => !mode);
  };

  const onSubmitHandler = (formEl: HTMLFormElement) => {
    const formData = new FormData(formEl);
    props.onSubmitHandler(formData.get('rom') as File, {
      name: formData.get('name') as string,
      url: getStrVal(formData.get('url') as string),
      avatarUrl: getStrVal(formData.get('avatarUrl') as string),
      about: getStrVal(formData.get('about') as string),
      info: getStrVal(formData.get('info') as string),
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
              {props.game ? 'Edit Game' : 'New Game'}
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
                value={props.game?.name || ''}
                ref={el => [
                  validate(el, () => [MinStr(1, 'Required'), MaxStr(40)])
                ]}
                name="name"
              />
              {errors['name'] && <ErrorMessage msg={errors['name']} />}

              <input
                placeholder="Game url"
                class="w-full rounded-xl border p-3 placeholder:text-gray-400"
                name="url"
                value={props.game?.url || ''}
                ref={el => [validate(el, () => [MaxStr(255)])]}
              />
              {errors['url'] && <ErrorMessage msg={errors['url']} />}

              <input
                placeholder="Game avatar url"
                class="w-full rounded-xl border p-3 placeholder:text-gray-400"
                name="avatarUrl"
                value={props.game?.avatarUrl || ''}
                ref={el => [validate(el, () => [MaxStr(255)])]}
              />
              {errors['avatarUrl'] && (
                <ErrorMessage msg={errors['avatarUrl']} />
              )}

              <input
                placeholder="Game tags: separate each tag with a comma"
                class="w-full rounded-xl border p-3 placeholder:text-gray-400"
                name="tags"
                value={props.game?.tags || ''}
                ref={el => [validate(el, () => [validateTags])]}
              />
              {errors['tags'] && <ErrorMessage msg={errors['tags']} />}

              <textarea
                name="about"
                rows="4"
                class="w-full resize-none rounded-xl border border-gray-200 py-2 transition duration-150 ease-in-out placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
                placeholder="About this game"
                value={props.game?.about || ''}
                ref={el => [validate(el, () => [MaxStr(255)])]}
              />
              {errors['about'] && <ErrorMessage msg={errors['about']} />}

              <textarea
                name="info"
                rows="4"
                class="h-60 w-full resize-none rounded-xl border border-gray-200 py-2 transition duration-150 ease-in-out placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
                classList={{ hidden: !isEditMode() }}
                placeholder="Game discription (Support some markdowns)"
                onFocusOut={e => setContent(e.target.value)}
                value={content()}
                ref={el => [validate(el, () => [MaxStr(2000)])]}
              />
              {errors['info'] && <ErrorMessage msg={errors['info']} />}

              <Show when={!isEditMode()}>
                <div class="h-60 overflow-auto border border-white px-3 py-2">
                  <Markdown content={content()} />
                </div>
              </Show>

              <Show when={props.game}>
                <div class="flex items-center gap-1">
                  <i class="fa-regular fa-file-lines" />
                  <p
                    class="cursor-pointer font-semibold text-blue-500 underline"
                    onClick={() =>
                      setIsFileUploaderVisible(!isFileUploaderVisible())
                    }
                  >
                    {isFileUploaderVisible()
                      ? 'Upload new ROM file'
                      : 'Use old ROM file'}{' '}
                    (click to change)
                  </p>
                </div>
              </Show>
              <Show when={!props.game || isFileUploaderVisible()}>
                <div class="mb-6">
                  <input
                    class="block w-full cursor-pointer rounded-lg border bg-gray-50 text-sm text-gray-400 focus:outline-none"
                    type="file"
                    name="rom"
                    value="pdfsfsfsfsfs"
                    ref={el => {
                      if (props.game) {
                        return [];
                      }
                      return [
                        validate(el, () => [fileRequired], { onBlur: false })
                      ];
                    }}
                  />
                  <p class="mt-1 text-sm text-gray-400">
                    Upload your ROM (Max file size: 4KB)
                  </p>
                  <Show when={errors['rom']}>
                    <ErrorMessage msg={errors['rom'] as string} />
                  </Show>
                </div>
              </Show>
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
