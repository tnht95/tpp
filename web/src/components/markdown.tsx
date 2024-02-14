import remarkGfm from 'remark-gfm';
import { SolidMarkdown } from 'solid-markdown';

type Props = {
  content: string;
};

export const Markdown = (props: Props) => (
  <SolidMarkdown
    class="markdown"
    remarkPlugins={[remarkGfm]}
    children={props.content}
  />
);
