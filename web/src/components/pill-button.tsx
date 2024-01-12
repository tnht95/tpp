type PillButtonProp = {
  title: string;
  number: number;
  icon: string;
};
export const PillButton = (props: PillButtonProp) => (
  <div class="flex text-center border rounded-lg md:border-none">
    <div class="flex items-center px-2 py-1 bg-gray-200 border-gray-400 cursor-pointer md:rounded-l-lg md:border-t md:border-l md:border-b hover:bg-gray-400">
      <i class={`${props.icon} mr-1 text-sm`} />
      <span class="self-center text-sm font-medium">{props.title}</span>
    </div>
    <div class="px-2 py-1 text-sm font-semibold border border-t border-gray-400 rounded-r-lg">
      {props.number}
    </div>
  </div>
);
