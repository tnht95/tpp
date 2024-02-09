import { Modal, ModalOptions } from 'flowbite';
import { createEffect, createSignal, Setter } from 'solid-js';

export type ModalUtil = {
  show: () => void;
  hide: () => void;
  initRef: Setter<HTMLDivElement | undefined>;
};

export const useModal = (opts?: ModalOptions): ModalUtil => {
  const [modalRef, setModalRef] = createSignal<HTMLDivElement>();
  const [modal, setModal] = createSignal<Modal>();
  createEffect(() => {
    const ref = modalRef();
    if (ref) setModal(new Modal(modalRef(), opts));
  });
  return {
    show: () => modal()?.show(),
    hide: () => modal()?.hide(),
    initRef: setModalRef
  };
};
