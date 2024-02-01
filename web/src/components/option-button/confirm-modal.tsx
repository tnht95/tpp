import { Accessor, Ref } from 'solid-js';

type ConfirmModalProps = {
  setModalRef: Ref<HTMLDivElement>;
  onCloseHandler: () => void;
  onDelete: (postId: string, index: number) => void;
  id: string;
  index: Accessor<number>;
};

export const ConfirmModal = (props: ConfirmModalProps) => (
  <div
    ref={props.setModalRef}
    tabindex="-1"
    class="fixed inset-x-0 top-0 z-50 hidden h-[calc(100%-1rem)] max-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden md:inset-0"
  >
    <div class="relative max-h-full w-full max-w-md">
      <div class="relative rounded-xl bg-white shadow">
        <button
          type="button"
          class="absolute end-2.5 top-3 ms-auto inline-flex size-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
          onClick={() => props.onCloseHandler()}
        >
          <i class="fa-solid fa-x text-xs" />
          <span class="sr-only">Close modal</span>
        </button>
        <div class="px-4 py-6 text-center">
          <i class="fa-regular fa-circle-question mb-3 text-4xl text-red-600" />
          <h3 class="mb-5 text-lg font-normal text-gray-700">
            Are you sure you want to delete this?
          </h3>
          <div class="flex items-center justify-center gap-4">
            <button
              type="button"
              class="me-2 inline-flex items-center rounded-lg border border-red-600 bg-red-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-white hover:text-red-600 focus:outline-none"
              onClick={() => {
                props.onCloseHandler();
                props.onDelete(props.id, props.index());
              }}
            >
              Yes, I'm sure
            </button>
            <button
              type="button"
              class="me-2 rounded-lg border border-gray-100 bg-gray-100 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-white focus:z-10 focus:outline-none"
              onClick={() => props.onCloseHandler()}
            >
              No, cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);
