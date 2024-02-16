import { BlogDetailsProvider } from '@/context';
import { BlogDetailsInfo } from '@/parts';

export const BlogDetails = () => (
  <BlogDetailsProvider>
    <BlogDetailsInfo />
  </BlogDetailsProvider>
);
