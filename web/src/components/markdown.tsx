import remarkGfm from 'remark-gfm';
import { SolidMarkdown } from 'solid-markdown';

type MarkdownProps = {
  content: string;
};

export const Markdown = (props: MarkdownProps) => (
  <SolidMarkdown class="markdown" remarkPlugins={[remarkGfm]} children={props.content} />
);
