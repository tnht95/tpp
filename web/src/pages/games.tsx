import { GameCard, Selects } from '@/components';
import { TagSidebar } from '@/parts';

export const Games = () => (
  <>
    <div class="ml-10 mt-5 flex flex-row justify-between">
      <div class="w-3/5">
        <p class="m-5 ml-0 text-2xl font-bold text-indigo-900">Newest Games</p>
        <div class="flex flex-row flex-wrap gap-7">
          <GameCard
            gameTitle="Space Invader"
            byUser="jack@gmail.com"
            stars={10}
            img="https://ajor.co.uk/images/chip8/connect4.png"
          />
          <GameCard
            gameTitle="Space Invader"
            byUser="jack@gmail.com"
            stars={10}
            img="https://ajor.co.uk/images/chip8/connect4.png"
          />
          <GameCard
            gameTitle="Space Invader"
            byUser="jack@gmail.com"
            stars={10}
            img="https://ajor.co.uk/images/chip8/connect4.png"
          />
          <GameCard
            gameTitle="Space Invader"
            byUser="jack@gmail.com"
            stars={10}
            img="https://ajor.co.uk/images/chip8/connect4.png"
          />
          <GameCard
            gameTitle="Space Invader"
            byUser="jack@gmail.com"
            stars={10}
            img="https://ajor.co.uk/images/chip8/connect4.png"
          />
        </div>
      </div>
      <div class="mr-24 w-1/5">
        <TagSidebar />
      </div>
    </div>
    <div>
      <div class="ml-10 mt-10 flex">
        <div class="flex-3">
          <div class="flex flex-row items-center">
            <p class="m-5 ml-0 text-2xl font-bold text-indigo-900">All Games</p>
            <Selects />
          </div>
          <div class="flex flex-row flex-wrap gap-7">
            <GameCard
              gameTitle="Space Invader"
              byUser="jack@gmail.com"
              stars={10}
              img="https://ajor.co.uk/images/chip8/connect4.png"
            />
            <GameCard
              gameTitle="Space Invader"
              byUser="jack@gmail.com"
              stars={10}
              img="https://ajor.co.uk/images/chip8/connect4.png"
            />
            <GameCard
              gameTitle="Space Invader"
              byUser="jack@gmail.com"
              stars={10}
              img="https://ajor.co.uk/images/chip8/connect4.png"
            />
            <GameCard
              gameTitle="Space Invader"
              byUser="jack@gmail.com"
              stars={10}
              img="https://ajor.co.uk/images/chip8/connect4.png"
            />
            <GameCard
              gameTitle="Space Invader"
              byUser="jack@gmail.com"
              stars={10}
              img="https://ajor.co.uk/images/chip8/connect4.png"
            />
            <GameCard
              gameTitle="Space Invader"
              byUser="jack@gmail.com"
              stars={10}
              img="https://ajor.co.uk/images/chip8/connect4.png"
            />
            <GameCard
              gameTitle="Space Invader"
              byUser="jack@gmail.com"
              stars={10}
              img="https://ajor.co.uk/images/chip8/connect4.png"
            />
            <GameCard
              gameTitle="Space Invader"
              byUser="jack@gmail.com"
              stars={10}
              img="https://ajor.co.uk/images/chip8/connect4.png"
            />
            <GameCard
              gameTitle="Space Invader"
              byUser="jack@gmail.com"
              stars={10}
              img="https://ajor.co.uk/images/chip8/connect4.png"
            />
          </div>
        </div>
        <div class="flex-1" />
      </div>
    </div>
  </>
);
