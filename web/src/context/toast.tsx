import {
  createContext,
  createEffect,
  createSignal,
  ParentProps,
  Show,
  useContext
} from 'solid-js';

import { Toast } from '@/components';

// ============================================================================
// Interfaces
// ============================================================================
type ToastContext = {
  dispatch: {
    showToast: (input: ToastInput) => void;
  };
};

export type ToastInput = {
  msg: string;
  type: 'Err' | 'Ok';
};

// ============================================================================
// Contexts
// ============================================================================
const toastCtx = createContext<ToastContext>();
export const ToastProvider = (props: ParentProps) => {
  // keep track of the previous timer
  let prevTimer: NodeJS.Timeout;

  // duration per show
  const duration = 5000; // 5s

  const [input, setInput] = createSignal<ToastInput>();

  // destroy toast utility
  const onCloseHandler = () => setInput();

  createEffect(() => {
    if (input()) {
      // clear the previous timer before setting a new one
      clearTimeout(prevTimer);
      prevTimer = setTimeout(onCloseHandler, duration);
    }
  });

  const state = {
    dispatch: {
      showToast: setInput
    }
  };

  return (
    <toastCtx.Provider value={state}>
      {props.children}
      <Show when={input()}>
        <Toast input={input() as ToastInput} onClose={onCloseHandler} />
      </Show>
    </toastCtx.Provider>
  );
};

// ============================================================================
// Component Apis
// ============================================================================
export const useToastCtx = () => useContext(toastCtx) as ToastContext;
