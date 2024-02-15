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
      <div class="w-1/6">
        <TagSidebar tags={tagResource()} loading={() => tagResource.loading} />
      </div>
    </div>
  );
};
