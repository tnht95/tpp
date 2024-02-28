import { Dropdown, DropdownOptions } from 'flowbite';
import { Accessor, createEffect, createSignal, Setter } from 'solid-js';

export type DropdownUtil = {
  show: () => void;
  hide: () => void;
  initRef: Setter<HTMLDivElement | undefined>;
  initBtnRef: Setter<HTMLButtonElement | undefined>;
  dropdownRef: Accessor<HTMLDivElement | undefined>;
};

export const useDropdownUtils = (opts?: DropdownOptions): DropdownUtil => {
  const [dropdownRef, setDropdownRef] = createSignal<HTMLDivElement>();
  const [btnRef, setBtnRef] = createSignal<HTMLButtonElement>();
  const [dropdown, setDropdown] = createSignal<Dropdown>();
  createEffect(() => {
    if (dropdownRef() && btnRef()) {
      setDropdown(new Dropdown(dropdownRef(), btnRef(), opts));
    }
  });
  return {
    show: () => dropdown()?.show(),
    hide: () => dropdown()?.hide(),
    initRef: setDropdownRef,
    initBtnRef: setBtnRef,
    dropdownRef
  };
};
