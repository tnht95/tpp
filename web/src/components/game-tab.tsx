type GameTabProp = {
  title: string;
  url: string;
};
export const GameTab = (props: GameTabProp) => (
  <a href={props.url}>
    <div
      class="flex items-center px-4 pb-2 text-sm border-b-2 "
      classList={{ 'border-indigo-900': false }}
    >
      <i class="fa-solid fa-wand-sparkles mr-1" />
      {props.title}
    </div>
  </a>
);
