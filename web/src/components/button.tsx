type Props = {
  title: string;
  withIcon?: string;
  customStyle?: string;
  onClickHandler?: () => void;
};

export const Button = (props: Props) => (
  <button
    class={`${props.customStyle} rounded-lg border px-7 py-2`}
    onClick={() => props.onClickHandler && props.onClickHandler()}
  >
    {props.withIcon && <i class={`${props.withIcon} mr-2`} />}
    {props.title}
  </button>
);
