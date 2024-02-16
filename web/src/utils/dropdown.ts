import { Dropdown, DropdownOptions } from 'flowbite';
import { createEffect, createSignal, Setter } from 'solid-js';

export type DropdownUtil = {
  initRef: Setter<HTMLDivElement | undefined>;
  initBtnRef: Setter<HTMLButtonElement | undefined>;
};

export const useDropdownUtils = (opts?: DropdownOptions): DropdownUtil => {
  const [dropdownRef, setDropdownRef] = createSignal<HTMLDivElement>();
  const [btnRef, setBtnRef] = createSignal<HTMLButtonElement>();
  createEffect(() => {
    new Dropdown(dropdownRef(), btnRef(), opts);
  });
  return {
    initRef: setDropdownRef,
    initBtnRef: setBtnRef
  };
};
