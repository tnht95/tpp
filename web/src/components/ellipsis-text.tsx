type EllipsisTextProps = {
  children: string | string[];
  customStyle?: string;
  maxWidth: string;
};

export const EllipsisText = (props: EllipsisTextProps) => (
  <p class={`truncate ${props.maxWidth} ${props.customStyle}`}>
    {props.children}
  </p>
);
