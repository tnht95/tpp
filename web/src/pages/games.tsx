import { createResource, For } from 'solid-js';

import { GameCard, Selects } from '@/components';
import { Game, Reponse } from '@/models';
import { TagSidebar } from '@/parts';

const fetchGame = (): Promise<Reponse<Game[]>> =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/games`)
    .then(r => r.json())
    .catch(() => {}) as Promise<Reponse<Game[]>>;

export const Games = () => {
  const [games] = createResource(fetchGame);

  return (
    <>
      <div class="ml-10 mt-5 flex flex-row justify-between">
        <div class="w-3/5">
          <p class="m-5 ml-0 text-2xl font-bold text-indigo-900">
            Most Subscribed Games
          </p>
          <div class="flex flex-row flex-wrap gap-7">
            <GameCard
              name="Space Invader"
              byUser="jack@gmail.com"
              stars={10}
              img="https://ajor.co.uk/images/chip8/connect4.png"
            />
            <GameCard
              name="Space Invader"
              byUser="jack@gmail.com"
              stars={10}
              img="https://ajor.co.uk/images/chip8/connect4.png"
            />
            <GameCard
              name="Space Invader"
              byUser="jack@gmail.com"
              stars={10}
              img="https://ajor.co.uk/images/chip8/connect4.png"
            />
            <GameCard
              name="Space Invader"
              byUser="jack@gmail.com"
              stars={10}
              img="https://ajor.co.uk/images/chip8/connect4.png"
            />
            <GameCard
              name="Space Invader"
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
              <p class="m-5 ml-0 text-2xl font-bold text-indigo-900">
                All Games
              </p>
              <Selects />
            </div>
            <div class="flex flex-row flex-wrap gap-7">
              <For each={games()?.data}>
                {game => (
                  <GameCard
                    name={game.name}
                    byUser={game.author_name}
                    stars={game.stars}
                    img={game.avatar_url}
                  />
                )}
              </For>
            </div>
          </div>
          <div class="flex-1" />
        </div>
      </div>
    </>
  );
};
