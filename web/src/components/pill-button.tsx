import { Show } from 'solid-js';

type PillButtonProp = {
  title: string;
  number: number;
  icon: string;
  disabled?: boolean;
};
export const PillButton = (props: PillButtonProp) => (
  <div class="flex rounded-lg border text-center md:border-none">
    <button
      disabled={!!props.disabled}
      class={`flex items-center rounded-l-lg border-y border-l border-gray-400 bg-gray-200 px-2 py-1 ${props.disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-gray-400 '}`}
    >
      <Show when={!props.disabled}>
        <i class={`${props.icon} mr-1 text-sm`} />
      </Show>
      <span class="self-center text-sm font-medium">{props.title}</span>
    </button>
    <div class="rounded-r-lg border border-gray-400 px-2 py-1 text-sm font-semibold">
      {props.number}
    </div>
  </div>
);
