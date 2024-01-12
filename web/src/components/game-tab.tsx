import { A } from '@solidjs/router';

type GameTabProp = {
  title: string;
  url: string;
  icon: string;
};

export const GameTab = (props: GameTabProp) => (
  <A
    href={props.url}
    inactiveClass="border-b-2"
    activeClass="border-b-2 border-orange-400"
  >
    <div
      class="flex items-center px-4 pb-2 text-sm"
      classList={{ 'border-indigo-900': false }}
    >
      <i class={`${props.icon} mr-1`} />
      {props.title}
    </div>
  </A>
);
