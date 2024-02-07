import { Show } from 'solid-js';

type ShowMoreButtonProps = {
  vertical?: boolean;
  onClick: () => void;
  customStyle?: string;
};

export const ShowMoreButton = (props: ShowMoreButtonProps) => (
  <div
    class={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-gray-500 p-5 text-gray-500 ${props.customStyle}`}
    classList={{ 'w-48 h-[212px]': !props.vertical }}
    onClick={() => props.onClick()}
  >
    <p class="text-center">Show more</p>
    <Show
      when={props.vertical}
      fallback={<i class="fa-solid fa-angles-right" />}
    >
      <i class="fa-solid fa-angles-down" />
    </Show>
  </div>
);
