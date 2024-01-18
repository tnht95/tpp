type PillButtonProp = {
  title: string;
  number: number;
  icon: string;
};
export const PillButton = (props: PillButtonProp) => (
  <div class="flex rounded-lg border text-center md:border-none">
    <div class="flex cursor-pointer items-center border-gray-400 bg-gray-200 px-2 py-1 hover:bg-gray-400 md:rounded-l-lg md:border-y md:border-l">
      <i class={`${props.icon} mr-1 text-sm`} />
      <span class="self-center text-sm font-medium">{props.title}</span>
    </div>
    <div class="rounded-r-lg border border-gray-400 px-2 py-1 text-sm font-semibold">
      {props.number}
    </div>
  </div>
);
