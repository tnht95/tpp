import { Gamecard, Selects, Tag } from '@/components';

export const Games = () => (
  <>
    <div class="ml-10 flex flex-row">
      <div class="flex-3">
        <p class="text-2xl font-bold text-indigo-900 m-5 ml-0">Newest Games</p>
        <div class="flex flex-row flex-wrap gap-7">
          <Gamecard />
          <Gamecard />
          <Gamecard />
          <Gamecard />
          <Gamecard />
        </div>
      </div>
      <div class="flex-1">
        <p class="text-2xl font-bold text-indigo-900 m-5 ml-0">Tags</p>
        <div class="flex flex-row flex-wrap gap-5">
          <Tag />
          <Tag />
          <Tag />
          <Tag /> <Tag />
          <Tag />
          <Tag />
        </div>
      </div>
    </div>
    <div>
      <div class="ml-10 mt-10 flex">
        <div class="flex-3">
          <div class="flex flex-row items-center">
            <p class="text-2xl font-bold text-indigo-900 m-5 ml-0">All Games</p>
            <Selects />
          </div>
          <div class="flex flex-row flex-wrap gap-7">
            <Gamecard />
            <Gamecard />
            <Gamecard />
            <Gamecard />
            <Gamecard />
            <Gamecard />
            <Gamecard />
            <Gamecard />
            <Gamecard />
            <Gamecard />
            <Gamecard />
            <Gamecard />
            <Gamecard />
            <Gamecard />
            <Gamecard />
          </div>
        </div>
        <div class="flex-1" />
      </div>
    </div>
  </>
);
