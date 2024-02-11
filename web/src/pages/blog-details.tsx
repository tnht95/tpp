import { BlogDetailsProvider } from '@/context';
import { BlogInfo } from '@/parts';

export const BlogDetails = () => (
  <BlogDetailsProvider>
    <BlogInfo />
  </BlogDetailsProvider>
);
