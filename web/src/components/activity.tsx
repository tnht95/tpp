type ActivityProps = {
  title: string;
  date: string;
};

export const Activity = (props: ActivityProps) => (
  <li class="mb-10 ms-6">
    <span class="absolute -start-3 flex size-6 items-center justify-center rounded-full bg-green-100 ring-8 ring-white">
      <i class="fa-solid fa-wave-square text-xs text-green-500" />
    </span>
    <h3 class="mb-1 flex items-center text-lg font-semibold text-gray-900">
      {props.title}
    </h3>
    <time class="mb-2 block text-sm font-normal leading-none text-gray-400">
      {props.date}
    </time>
    <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
      Get access to over 20+ pages including a dashboard layout, charts, kanban
      board, calendar, and pre-order E-commerce & Marketing pages.
    </p>
  </li>
);
