import { Tag } from '@/components';

export const BlogPost = () => (
  <div class=" px-10 my-4 py-6 bg-white border rounded-xl">
    <div class="flex justify-between items-center">
      <span class="font-light text-gray-600">mar 10, 2019</span>
      <Tag name="Game making" />
    </div>
    <div class="mt-2">
      <a class="text-2xl text-gray-700 font-bold hover:text-gray-600" href="#">
        Accessibility tools for designers and developers
      </a>
      <p class="mt-2 text-gray-600">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempora
        expedita dicta totam aspernatur doloremque. Excepturi iste iusto eos
        enim reprehenderit nisi, accusamus delectus nihil quis facere in modi
        ratione libero!
      </p>
    </div>
    <div class="flex justify-between items-center mt-4">
      <a class="text-blue-600 hover:underline" href="#">
        Read more
      </a>
      <div />
    </div>
  </div>
);
