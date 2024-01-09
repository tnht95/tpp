import { Gamecard } from '@/components';

export const Games = () => (
  <div class="ml-5">
    <p class="text-xl font-bold text-indigo-900 m-5 ml-0">Newest Games</p>
    <div class="flex flex-row flex-wrap gap-7">
      <Gamecard />
      <Gamecard />
      <Gamecard />
      <Gamecard />
      <Gamecard />
    </div>
  </div>
);
