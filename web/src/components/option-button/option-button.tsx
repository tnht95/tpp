import { Dropdown, Modal } from 'flowbite';
import { createEffect, createSignal, Show } from 'solid-js';
import { ConfirmModal } from './confirm-modal';

type OptionButtonProp = {
  id: string;
  isOwner: boolean;
  customStyle?: string;
};
export const OptionButton = (props: OptionButtonProp) => {
  const [userDropdownRef, setUserDropdownRef] = createSignal<HTMLDivElement>();
  const [userBtnRef, setUserBtnRef] = createSignal<HTMLButtonElement>();

  const [modalRef, setModalRef] = createSignal<HTMLDivElement>();
  const [modal, setModal] = createSignal<Modal>();

  createEffect(() => {
    new Dropdown(userDropdownRef(), userBtnRef());
    setModal(new Modal(modalRef()));
  });

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
      <span ref={setUserBtnRef}>
        <i
          class={`fa-solid fa-ellipsis cursor-pointer text-lg text-gray-300 hover:text-gray-500 ${props.customStyle}`}
        />
      </span>
      <div
        ref={setUserDropdownRef}
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
                href=""
                class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                onclick={() => {
                  modal()?.show();
                }}
              >
                <i class="fa-solid fa-trash-can mr-2" />
                Delete
              </a>
            </li>
          </Show>
        </ul>
      </div>
      <ConfirmModal
        setModalRef={setModalRef}
        onCloseHandler={() => modal()?.hide()}
      />
    </>
  );
};
