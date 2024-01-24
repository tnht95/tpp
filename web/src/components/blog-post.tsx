import { For } from 'solid-js';

import { Tag } from '@/components';

type BlogPostProp = {
  date: string;
  title: string;
  description: string;
  tags: string[] | null;
};
export const BlogPost = (props: BlogPostProp) => (
  <div class="my-2 rounded-xl border bg-white px-10 py-6">
    <div class="flex items-center justify-between">
      <span class="font-light text-gray-600">{props.date}</span>
      {props.tags && props.tags.length > 0 && (
        <div class="flex items-center gap-3">
          <For each={props.tags}>{tag => <Tag name={tag} />}</For>
        </div>
      )}
    </div>
    <div class="mt-2">
      <a class="text-2xl font-bold text-gray-700 hover:text-gray-600" href="#">
        {props.title}
      </a>
      <p class="mt-2 text-gray-600">{props.description}</p>
    </div>
    <div class="mt-4 flex items-center justify-between">
      <a class="text-blue-600 hover:underline" href="/">
        Read more
      </a>
      <div />
    </div>
  </div>
);
