type ValidationToast = {
  msg: string;
  onClose: () => void;
};

export const ValidationToast = (props: ValidationToast) => (
  <>
    <div
      class="fixed bottom-5 left-5 mb-4 flex items-center rounded-lg border border-red-300 bg-red-50 p-4 text-red-800"
      role="alert"
    >
      <div class="flex items-center">
        <svg
          class="me-2 size-4 shrink-0"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
        <span class="sr-only">Info</span>
        <h3 class="text-lg font-medium">{props.msg}</h3>
      </div>
      <button
        onClick={() => props.onClose()}
        type="button"
        class="-m-1.5 ms-auto inline-flex size-8 items-center justify-center rounded-lg bg-white p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300"
        aria-label="Close"
      >
        <span class="sr-only">Close</span>
        <svg
          class="size-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
      </button>
    </div>
  </>
);
