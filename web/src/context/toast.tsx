import {
  createContext,
  createEffect,
  createSignal,
  ParentProps,
  Show,
  useContext
} from 'solid-js';

import { ValidationToast } from '@/components';

// ============================================================================
// Interfaces
// ============================================================================
type ToastContext = {
  dispatch: {
    showToast: (msg: string) => void;
  };
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

  const [msg, setMsg] = createSignal('');

  // destroy toast utility
  const onCloseHandler = () => setMsg('');

  createEffect(() => {
    if (msg()) {
      // clear the previous timer before setting a new one
      clearTimeout(prevTimer);
      prevTimer = setTimeout(onCloseHandler, duration);
    }
  });

  const state = {
    dispatch: {
      showToast: setMsg
    }
  };

  return (
    <toastCtx.Provider value={state}>
      {props.children}
      <Show when={msg()}>
        <ValidationToast msg={msg()} onClose={onCloseHandler} />
      </Show>
    </toastCtx.Provider>
  );
};

// ============================================================================
// Component Apis
// ============================================================================
export const useToast = () => useContext(toastCtx) as ToastContext;
