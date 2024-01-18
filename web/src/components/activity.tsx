type ActivityProp = {
  title: string;
  date: string;
  latest?: boolean;
};
export const Activity = (props: ActivityProp) => (
  <li class="mb-10 ms-6">
    <span class="absolute -start-3 flex size-6 items-center justify-center rounded-full bg-green-100 ring-8 ring-white dark:bg-blue-900 dark:ring-gray-900">
      <i class="fa-solid fa-wave-square text-xs text-green-500" />
    </span>
    <h3 class="mb-1 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
      {props.title}
      {props.latest && (
        <span class="me-2 ms-3 rounded bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
          Latest
        </span>
      )}
    </h3>
    <time class="mb-2 block text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
      {props.date}
    </time>
    <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
      Get access to over 20+ pages including a dashboard layout, charts, kanban
      board, calendar, and pre-order E-commerce & Marketing pages.
    </p>
  </li>
);
