type ButtonProps = {
  title: string;
  withIcon?: string;
  customStyle?: string;
};
export const Button = (props: ButtonProps) => (
  <button class={`${props.customStyle} border rounded-lg py-2 px-7`}>
    {props.withIcon && <i class={`${props.withIcon} mr-2`} />}
    {props.title}
  </button>
);
