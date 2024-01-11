import { GameDetailsSidebar, GameDetailsTabs, GameInfo } from '@/parts';

export const GameDetails = () => (
  <div class="bg-white">
    <GameDetailsTabs />
    <div class="container pb-10  mt-8 ml-10">
      <div class="md:flex">
        <div class=" mr-4 w-3/4">
          <GameInfo />
        </div>
        <GameDetailsSidebar />
      </div>
    </div>
  </div>
);
