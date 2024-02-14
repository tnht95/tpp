import { createResource } from 'solid-js';

import { fetchBlogTagsAction } from '@/apis';
import { BlogsProvider } from '@/context';
import { BlogList, TagSidebar } from '@/parts';

export const Blogs = () => {
  const [tagResource] = createResource(fetchBlogTagsAction);
  return (
    <div class="flex justify-between p-10">
      <BlogsProvider>
        <BlogList />
      </BlogsProvider>
      <div class="w-1/5">
        <TagSidebar tags={tagResource() as string[]} />
      </div>
    </div>
  );
};
