import { Ref } from 'solid-js';

type ConfirmModalProps = {
  setModalRef: Ref<HTMLDivElement>;
  onCloseHandler: () => void;
};

export const ConfirmModal = (props: ConfirmModalProps) => (
  <div
    ref={props.setModalRef}
    tabindex="-1"
    class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
  >
    <div class="relative w-full max-w-md max-h-full">
      <div class="relative bg-white rounded-xl shadow ">
        <button
          type="button"
          class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
          onClick={() => props.onCloseHandler()}
        >
          <i class="fa-solid fa-x text-xs" />
          <span class="sr-only">Close modal</span>
        </button>
        <div class="px-4 py-6  text-center">
          <i class="fa-regular fa-circle-question text-4xl text-red-600 mb-3" />
          <h3 class="mb-5 text-lg font-normal text-gray-700 ">
            Are you sure you want to delete this?
          </h3>
          <div class="flex gap-4 items-center justify-center">
            <button
              type="button"
              class="text-white bg-red-600 hover:bg-white focus:outline-none border border-red-600  hover:text-red-600 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2"
            >
              Yes, I'm sure
            </button>
            <button
              type="button"
              class="text-gray-700 bg-gray-100 focus:outline-none hover:bg-white rounded-lg border border-gray-100 text-sm font-medium px-5 py-2.5 me-2  focus:z-10 "
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
