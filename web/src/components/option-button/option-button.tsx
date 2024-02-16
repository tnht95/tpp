import { Accessor, mergeProps, Show } from 'solid-js';

import { useDropdownUtils, useModalUtils } from '@/utils';

import { ConfirmModal } from './confirm-modal';

type Props = {
  isOwner: boolean;
  customStyle?: string;
  onDeleteConfirm: (id: string) => void;
  id: string;
  isEditMode?: Accessor<boolean>;
  onEditBtnClick: () => void;
};

const otherContent = (
  <li>
    <a class="block px-4 py-2 hover:bg-gray-100">
      <i class="fa-solid fa-reply mr-2" />
      Reply
    </a>
  </li>
);

export const OptionButton = (propInput: Props) => {
  const props = mergeProps({ isEditMode: () => false }, propInput);
  const modalUtils = useModalUtils();
  const dropdownUtils = useDropdownUtils({ offsetDistance: 14 });
  return (
    <div class="cursor-pointer select-none text-lg text-gray-300 hover:text-gray-500">
      <span ref={dropdownUtils.initBtnRef}>
        <i class={`fa-solid fa-ellipsis ${props.customStyle}`} />
      </span>
      <div
        ref={dropdownUtils.initRef}
        class="z-10 hidden w-28 divide-y divide-gray-100 rounded-lg bg-white shadow"
      >
        <ul class="py-2 text-sm text-gray-700">
          <Show when={props.isOwner} fallback={otherContent}>
            <li>
              <a
                class="block px-4 py-2 hover:bg-gray-100"
                onClick={() => props.onEditBtnClick()}
              >
                <i class="fa-solid fa-pencil mr-2" />
                <Show when={props.isEditMode()} fallback={'Edit'}>
                  Cancel
                </Show>
              </a>
            </li>
            <li>
              <a
                class="block px-4 py-2 hover:bg-gray-100"
                onClick={modalUtils.show}
              >
                <i class="fa-solid fa-trash-can mr-2" />
                Delete
              </a>
            </li>
          </Show>
        </ul>
      </div>
      <ConfirmModal
        onDelete={props.onDeleteConfirm}
        id={props.id}
        setModalRef={modalUtils.initRef}
        onCloseHandler={modalUtils.hide}
      />
    </div>
  );
};
