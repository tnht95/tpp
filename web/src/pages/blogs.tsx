import { BlogForm, BlogPost, Button } from '@/components';

export const Blogs = () => (
  <div class="w-4/6 ml-10 mt-10">
    <div class="flex items-center justify-between">
      <p class="font-bold text-4xl ">Blogs</p>
      <Button
        title="Add New Blog"
        withIcon="fa-solid fa-plus"
        customStyle="bg-green-400 text-white font-bold hover:text-indigo-900 hover:bg-white"
        modalTargetId="blog-modal"
      />
      <BlogForm />
    </div>
    <div class=" flex flex-col gap-5 mt-5">
      <BlogPost />
      <BlogPost />
      <BlogPost />
    </div>
  </div>
);
