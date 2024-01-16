import { Show } from 'solid-js';

type ShowMoreButtonProp = {
  vertical?: boolean;
};

export const ShowMoreButton = (props: ShowMoreButtonProp) => (
  <div class="border rounded-lg border-dashed border-gray-500  p-5 flex items-center gap-1 flex-col justify-center cursor-pointer text-gray-500">
    <p class="text-center">Show more</p>

    <Show
      when={props.vertical}
      fallback={<i class="fa-solid fa-angles-right" />}
    >
      <i class="fa-solid fa-angles-down" />
    </Show>
  </div>
);
