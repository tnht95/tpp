import { createSignal, onMount } from 'solid-js';

type ButtonProps = {
  title: string;
  withIcon?: string;
  customStyle?: string;
  modalTargetId?: string;
};
export const Button = (props: ButtonProps) => {
  const [dataAttributes, setDataAttributes] = createSignal({});

  onMount(() => {
    if (props.modalTargetId) {
      setDataAttributes({
        'data-modal-target': props.modalTargetId,
        'data-modal-toggle': props.modalTargetId
      });
    }
  });

  return (
    <button
      {...dataAttributes()}
      class={`${props.customStyle} rounded-lg border px-7 py-2`}
    >
      {props.withIcon && <i class={`${props.withIcon} mr-2`} />}
      {props.title}
    </button>
  );
};
