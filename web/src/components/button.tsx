import { createSignal, onMount } from 'solid-js';

type ButtonProps = {
  title: string;
  withIcon?: string;
  customStyle?: string;
  modalTargetId?: string;
};
export const Button = (props: ButtonProps) => {
  const [dataAttributes, setDataAttributes] = createSignal({}); // Signal for data attributes

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
      class={`${props.customStyle} border rounded-lg py-2 px-7`}
    >
      {props.withIcon && <i class={`${props.withIcon} mr-2`} />}
      {props.title}
    </button>
  );
};
