import { ToastInput } from '@/context';

export type toastProps = {
  input: ToastInput;
  onClose: () => void;
};

const toastStyle = {
  Ok: 'text-green-800 border-green-300 bg-green-50',
  Err: 'text-red-800 border-red-300 bg-red-50'
};

export const Toast = (props: toastProps) => (
  <div
    class={`fixed bottom-5 left-5 mb-4 flex items-center justify-center gap-5 rounded-lg border p-4 ${toastStyle[props.input.type]}`}
    role="alert"
  >
    <div class="flex items-center justify-center gap-1">
      <span class="sr-only">Info</span>
      <h3 class="text-lg font-medium">{props.input.msg}</h3>
    </div>
    <button
      onClick={() => props.onClose()}
      type="button"
      class="mt-0.5"
      aria-label="Close"
    >
      <i class="fa-solid fa-square-xmark " />
      <span class="sr-only">Close</span>
    </button>
  </div>
);
