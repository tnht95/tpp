import { For, Show } from 'solid-js';

import { Tag } from '@/components';

type TagSidebarProps = {
  tags: string[];
};
export const TagSidebar = (props: TagSidebarProps) => (
  <Show when={props.tags}>
    <p class="m-5 ml-0 text-2xl font-bold text-indigo-900">Tags</p>
    <div class="flex flex-row flex-wrap gap-3">
      <For each={props.tags}>{tag => <Tag name={tag} />}</For>
    </div>
  </Show>
);
