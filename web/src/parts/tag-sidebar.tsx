import { For, Show } from 'solid-js';

import { LoadingSpinner, Tag } from '@/components';

type Props = {
  tags: string[] | undefined;
  loading: () => boolean;
};
export const TagSidebar = (props: Props) => (
  <div class="flex flex-col gap-10">
    <p class="text-2xl font-bold text-indigo-900">Tags</p>
    <Show when={!props.loading()} fallback={<LoadingSpinner />}>
      <div class="flex flex-row flex-wrap gap-3">
        <For each={props.tags}>{tag => <Tag name={tag} />}</For>
      </div>
    </Show>
  </div>
);
