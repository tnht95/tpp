import { For, Show } from 'solid-js';

import { Tag } from '@/components';

type TagSidebarProps = {
  tags: string[];
};
export const TagSidebar = (props: TagSidebarProps) => (
  <Show when={props.tags}>
    <div class="flex flex-col gap-5">
      <p class="text-2xl font-bold text-indigo-900">Tags</p>
      <div class="flex flex-row flex-wrap gap-3">
        <For each={props.tags}>{tag => <Tag name={tag} />}</For>
      </div>
    </div>
  </Show>
);
