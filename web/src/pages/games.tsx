import { GameCard, Selects, Tag } from '@/components';

export const Games = () => (
  <>
    <div class="ml-10 flex flex-row">
      <div class="flex-3">
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
      <div class="mr-10 flex-1">
        <p class="m-5 ml-0 text-2xl font-bold text-indigo-900 ">Tags</p>
        <div class="flex flex-row flex-wrap gap-3">
          <Tag name="Name dgndjgbdjgbdjghbdgkjhdgdgdsgsdgsgsgdggsgsgsdgs" />
          <Tag name="Name" />
          <Tag name="Name" />
          <Tag name="Name" />
          <Tag name="Name" />
          <Tag name="Name" />
        </div>
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
