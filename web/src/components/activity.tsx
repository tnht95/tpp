type ActivityProp = {
  title: string;
  date: string;
  latest?: boolean;
};
export const Activity = (props: ActivityProp) => (
  <li class="mb-10 ms-6">
    <span class="absolute flex items-center justify-center w-6 h-6 bg-green-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
      <i class="fa-solid fa-wave-square text-xs text-green-500" />
    </span>
    <h3 class="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
      {props.title}
      {props.latest && (
        <span class="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 ms-3">
          Latest
        </span>
      )}
    </h3>
    <time class="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
      {props.date}
    </time>
    <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
      Get access to over 20+ pages including a dashboard layout, charts, kanban
      board, calendar, and pre-order E-commerce & Marketing pages.
    </p>
  </li>
);
