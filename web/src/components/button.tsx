type ButtonProps = {
  title: string;
  withIcon?: string;
  bgColor: string;
  textColor: string;
  hoverEffect?: string;
};
export const Button = (props: ButtonProps) => (
  <button
    class={`border rounded-lg font-bold py-2 px-7 ${props.textColor} ${props.bgColor} ${props.hoverEffect}`}
  >
    {props.withIcon && <i class={`${props.withIcon} mr-2`} />}
    {props.title}
  </button>
);
