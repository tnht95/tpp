import { createEffect, createSignal, For, Show } from 'solid-js';

import { Tag } from '@/components';
import { BlogSummary } from '@/models';
import { formatTime } from '@/utils';

type Props = {
  blog: BlogSummary;
};

export const BlogCard = (props: Props) => {
  const [isTagOverflow, setIsTagOverflow] = createSignal(false);
  const [tagContainerRef, setTagContainerRef] = createSignal<HTMLDivElement>();

  createEffect(() => {
    if (tagContainerRef()) {
      checkTagOverflow();
    }
  });
  const checkTagOverflow = () => {
    const tagContainer = tagContainerRef() as HTMLDivElement;
    if (tagContainer.scrollHeight > tagContainer.clientHeight) {
      setIsTagOverflow(true);
    }
  };
  return (
    <div class="flex flex-col gap-3 rounded-xl border bg-white px-10 py-6">
      <div class="flex items-center justify-between">
        <span class="font-light text-gray-600">
          {formatTime(props.blog.createdAt)}
        </span>
        <Show when={props.blog.tags}>
          <div
            ref={setTagContainerRef}
            class="flex max-h-8 w-full max-w-2/3 flex-row-reverse flex-wrap items-end justify-start gap-3 overflow-hidden"
          >
            <Show when={isTagOverflow()}>
              <i class="fa-solid fa-ellipsis text-indigo-300" />
            </Show>
            <For each={props.blog.tags}>{tag => <Tag name={tag} />}</For>
          </div>
        </Show>
      </div>
      <a
        class="text-2xl font-bold text-gray-700 hover:text-gray-600"
        href={`/blogs/${props.blog.id}`}
      >
        {props.blog.title}
      </a>
      <p class="text-gray-600">{props.blog.description}</p>
      <a class="text-blue-600 hover:underline" href={`/blogs/${props.blog.id}`}>
        Read more
      </a>
    </div>
  );
};
