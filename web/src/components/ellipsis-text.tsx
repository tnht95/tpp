type EllipsisTextProp = {
  children: string | string[];
  customStyle?: string;
  maxWidth: string;
};
export const EllipsisText = (props: EllipsisTextProp) => (
  <p class={`truncate ${props.maxWidth} ${props.customStyle}`}>
    {props.children}
  </p>
);
