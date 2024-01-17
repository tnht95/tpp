import { Show } from 'solid-js';

type OptionButtonProp = {
  id: string;
  isOwner: true;
  customStyle?: string;
};
export const OptionButton = (props: OptionButtonProp) => {
  const otherContent = (
    <li>
      <a
        href="#"
        class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
      >
        <i class="fa-solid fa-reply mr-2" />
        Reply
      </a>
    </li>
  );

  return (
    <>
      <span
        id={`${props.id} + 'btn'`}
        data-dropdown-toggle={`${props.id} + 'drop'`}
      >
        <i
          class={`fa-solid fa-ellipsis cursor-pointer text-lg text-gray-300 hover:text-gray-500 ${props.customStyle}`}
        />
      </span>
      <div
        id={`${props.id} + 'drop'`}
        class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-28 dark:bg-gray-700"
      >
        <ul
          class="py-2 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby={`${props.id} + 'btn'`}
        >
          <Show when={props.isOwner} fallback={otherContent}>
            <li>
              <a
                href="#"
                class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <i class="fa-solid fa-pencil mr-2" />
                Edit
              </a>
            </li>
            <li>
              <a
                href="#"
                class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <i class="fa-solid fa-trash-can mr-2" />
                Delete
              </a>
            </li>
          </Show>
        </ul>
      </div>
    </>
  );
};
