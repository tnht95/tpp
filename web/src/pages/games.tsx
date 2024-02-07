import {
  batch,
  createEffect,
  createResource,
  createSignal,
  For,
  Show
} from 'solid-js';
import { createStore, produce } from 'solid-js/store';

import {
  fetchGameAction,
  fetchGameTagsAction,
  GameQueryInput,
  OrderBy,
  OrderField
} from '@/apis';
import { GameCard, ShowMoreButton } from '@/components';
import { LIMIT, OFFSET } from '@/constant';
import { GameSummary } from '@/models';
import { TagSidebar } from '@/parts';

export const Games = () => {
  const [tagResource] = createResource(fetchGameTagsAction);
  const [selectValue, setSelectValue] = createSignal<GameQueryInput>({
    offset: 0,
    limit: LIMIT
  });
  const [gameResource] = createResource(selectValue, fetchGameAction, {
    initialValue: []
  });
  const [games, setGames] = createStore<GameSummary[]>([]);

  createEffect(() => {
    if (gameResource().length > 0) {
      setGames(produce(oldGames => oldGames.push(...gameResource())));
    }
  });

  const handleSelect = (e: Event) =>
    batch(() => {
      setGames([]);
      const valueArr = (e.target as HTMLSelectElement).value.split('-');
      setSelectValue({
        orderField: valueArr[0] as OrderField,
        orderBy: valueArr[1] as OrderBy,
        offset: 0,
        limit: LIMIT
      });
    });

  const onShowMoreHandler = () => {
    setSelectValue(oldValue => ({
      ...oldValue,
      offset: (oldValue.offset as number) + OFFSET
    }));
  };

  return (
    <div class="mt-10">
      <div class="ml-10  flex flex-row justify-between">
        <div class="w-3/5">
          <p class="mb-5 ml-0 text-2xl font-bold text-indigo-900">
            Most Subscribed Games
          </p>
          <div class="flex flex-row flex-wrap gap-7">
            <GameCard
              game={{
                id: '123456',
                name: 'Awesome Game',
                authorId: 1,
                authorName: 'John Doe',
                avatarUrl:
                  'https://johnearnest.github.io/chip8Archive/src/eaty/eaty.gif',
                upVotes: 100,
                downVotes: 20,
                tags: ['action', 'adventure'],
                createdAt: '2024-02-05T12:00:00Z'
              }}
            />
          </div>
        </div>
        <div class="mr-24 w-1/5">
          <TagSidebar tags={tagResource() as string[]} />
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
              <For each={games}>{game => <GameCard game={game} />}</For>
              <Show when={gameResource().length === LIMIT}>
                <ShowMoreButton onClick={onShowMoreHandler} />
              </Show>
            </div>
          </div>
          <div class="flex-1" />
        </div>
      </div>
    </div>
  );
};
