import { BlogsProvider } from '@/context';
import { BlogList } from '@/parts';

export const Blogs = () => (
  <BlogsProvider>
    <BlogList />
  </BlogsProvider>
);
