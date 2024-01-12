type ActivityProp = {
  title: string;
  date: string;
};
export const Activity = (props: ActivityProp) => (
  <div class="ml-2  flex items-center mb-5 border-b border-dashed border-gray-300 pb-5">
    <i class="fa-solid fa-wave-square text-lg text-green-500" />
    <div class="ml-3">
      <p class="text-base font-semibold">{props.title}</p>
      <p class="text-sm">{props.date}</p>
    </div>
  </div>
);
