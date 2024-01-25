import { createResource, createSignal, For } from 'solid-js';

import { fetchGameAction, GameQueryInput } from '@/apis';
import { GameCard } from '@/components';
import { TagSidebar } from '@/parts';

export const Games = () => {
  const [selectValue, setSelectValue] = createSignal<GameQueryInput>({});
  const [games] = createResource(selectValue, fetchGameAction);

  const handleSelect = (e: Event) => {
    const selectedOptionValue = (e.target as HTMLSelectElement).value;
    const valueArr = selectedOptionValue.split('-');

    if (valueArr.length == 1) {
      setSelectValue({ orderField: valueArr.at(0), orderBy: 'desc' });
    } else if (valueArr.length > 1) {
      setSelectValue({ orderField: valueArr.at(0), orderBy: valueArr.at(1) });
    }
  };

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
              <div class="flex items-center">
                <select
                  onChange={handleSelect}
                  class="block rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="" disabled selected>
                    Sort by
                  </option>
                  <option value="createdAt">Date</option>
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="stars">Stars</option>
                </select>
              </div>
            </div>
            <div class="flex flex-row flex-wrap gap-7">
              <For each={games()}>
                {game => (
                  <GameCard
                    name={game.name}
                    byUser={game.authorName}
                    stars={game.stars}
                    img={game.avatarUrl}
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
