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
  let prevTimeout: NodeJS.Timeout;
  const [msg, setMsg] = createSignal('');
  const onCloseHandler = () => setMsg('');
  createEffect(() => {
    if (msg()) {
      clearTimeout(prevTimeout);
      prevTimeout = setTimeout(onCloseHandler, 5000);
    }
  });
  const state = {
    dispatch: {
      showToast: (msg: string) => setMsg(msg)
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
