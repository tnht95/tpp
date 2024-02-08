import { For, Show } from 'solid-js';

import { Tag } from '@/components';
import { BlogSummary } from '@/models';
import { formatTime } from '@/utils';

type BlogPostProps = {
  blog: BlogSummary;
};

export const BlogCard = (props: BlogPostProps) => (
  <div class="flex flex-col gap-3 rounded-xl border bg-white px-10 py-6">
    <div class="flex items-center justify-between">
      <span class="font-light text-gray-600">
        {formatTime(props.blog.createdAt)}
      </span>
      <Show when={props.blog.tags}>
        <div class="flex items-center gap-3">
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
