import {
  batch,
  createEffect,
  createResource,
  createSignal,
  For,
  Show
} from 'solid-js';
import { createStore, produce } from 'solid-js/store';

import { fetchGameAction, GameQueryInput, OrderBy, OrderField } from '@/apis';
import { GameCard, ShowMoreButton } from '@/components';
import { LIMIT } from '@/constant';
import { GameSummary } from '@/models';
import { TagSidebar } from '@/parts';

export const Games = () => {
  const [selectValue, setSelectValue] = createSignal<GameQueryInput>({});
  const [gameResource] = createResource(selectValue, fetchGameAction, {
    initialValue: []
  });
  const [games, setGames] = createStore<GameSummary[]>(gameResource());
  const [currentOffset, setCurrentOffset] = createSignal(0);

  createEffect(() => {
    if (gameResource().length > 0) {
      batch(() => {
        setGames(produce(oldGames => oldGames.push(...gameResource())));
      });
    }
  });

  const handleSelect = (e: Event) => {
    setGames([]);
    setCurrentOffset(0);
    const selectedOptionValue = (e.target as HTMLSelectElement).value;
    const valueArr = selectedOptionValue.split('-');

    setSelectValue({
      orderField: valueArr[0] as OrderField,
      orderBy: valueArr[1] as OrderBy
    });
  };

  const handleGetMore = () => {
    batch(() => {
      setCurrentOffset(offset => offset + LIMIT);
      setSelectValue(oldValue => ({
        ...oldValue,
        offset: currentOffset()
      }));
    });
  };

  const nothingMoreToShow = () => (
    <div class="flex w-40 items-center text-gray-400">Nothing more to show</div>
  );

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
                  <option value="createdAt-desc">Date</option>
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="stars-desc">Stars</option>
                </select>
              </div>
            </div>
            <div class="flex flex-row flex-wrap gap-7">
              <For each={games}>
                {game => (
                  <GameCard
                    name={game.name}
                    byUser={game.authorName}
                    stars={game.stars}
                    img={game.avatarUrl}
                  />
                )}
              </For>
              <Show
                when={gameResource().length === LIMIT}
                fallback={nothingMoreToShow()}
              >
                <ShowMoreButton onClick={handleGetMore} />
              </Show>
            </div>
          </div>
          <div class="flex-1" />
        </div>
      </div>
    </>
  );
};
