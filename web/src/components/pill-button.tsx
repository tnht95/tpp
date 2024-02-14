import { Show } from 'solid-js';

type Props = {
  title: string;
  number: number;
  icon: string;
  disabled: boolean;
  onClick: () => void;
  clicked: boolean;
  titleAfterClicked: string;
  iconAfterClicked?: string;
};

const buttonColor = {
  Clicked: 'border-indigo-900 bg-indigo-900 text-white',
  Default: 'border-gray-400 bg-gray-200'
};

export const PillButton = (props: Props) => {
  const contentDefault = () => (
    <>
      <i class={`${props.icon} mr-1 text-sm`} />
      <span class="self-center text-sm font-medium">{props.title}</span>
    </>
  );

  return (
    <div
      class="flex rounded-lg border text-center md:border-none"
      classList={{ 'opacity-50': props.disabled }}
    >
      <button
        onClick={() => props.onClick()}
        disabled={props.disabled}
        class={`flex items-center rounded-l-lg border ${props.clicked ? buttonColor['Clicked'] : buttonColor['Default']} px-2 py-1 ${props.disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:border-gray-400 hover:bg-gray-400 '}`}
      >
        <Show when={props.clicked} fallback={contentDefault()}>
          <i class={`${props.iconAfterClicked ?? props.icon}  mr-1 text-sm`} />
          <span class="self-center text-sm font-medium">
            {props.titleAfterClicked}
          </span>
        </Show>
      </button>
      <div class="rounded-r-lg border-y border-r border-gray-400 px-2 py-1 text-sm font-semibold">
        {props.number}
      </div>
    </div>
  );
};
