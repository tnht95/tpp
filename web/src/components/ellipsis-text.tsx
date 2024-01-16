type EllipsisTextProp = {
  children: string | string[],
  customStyle?: string,
  maxWidth: string
}
export const EllipsisText = (props: EllipsisTextProp) => (
  <p class={`whitespace-nowrap overflow-ellipsis overflow-hidden ${props.maxWidth} ${props.customStyle}`}>{props.children}</p>
)
