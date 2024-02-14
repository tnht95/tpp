type Props = {
  children: string | string[];
  customStyle?: string;
  maxWidth: string;
};

export const EllipsisText = (props: Props) => (
  <p class={`truncate ${props.maxWidth} ${props.customStyle}`}>
    {props.children}
  </p>
);
