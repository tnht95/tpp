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
import { PAGINATION } from '@/constant';
import { GameSummary } from '@/models';
import { TagSidebar } from '@/parts';

export const Games = () => {
  const [tagResource] = createResource(fetchGameTagsAction);
  const [selectValue, setSelectValue] = createSignal<GameQueryInput>({
    offset: 0,
    limit: PAGINATION
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
        limit: PAGINATION
      });
    });

  const onShowMoreHandler = () => {
    setSelectValue(oldValue => ({
      ...oldValue,
      offset: (oldValue.offset as number) + PAGINATION
    }));
  };

  return (
    <div class="flex p-10">
      <div class="flex w-4/5 flex-col gap-10">
        <div class="flex flex-col gap-7">
          <p class="text-2xl font-bold text-indigo-900">
            Most Subscribed Games
          </p>
          <div class="flex flex-wrap gap-7">
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
        <div class="flex flex-col gap-7">
          <div class="flex flex-row items-center gap-7">
            <p class="text-2xl font-bold text-indigo-900">All Games</p>
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
                <option value="votes-desc">Votes</option>
              </select>
            </div>
          </div>
          <div class="flex flex-row flex-wrap gap-7">
            <For each={games}>{game => <GameCard game={game} />}</For>
            <Show when={gameResource().length === PAGINATION}>
              <ShowMoreButton onClick={onShowMoreHandler} />
            </Show>
          </div>
        </div>
      </div>
      <div class="w-1/5">
        <TagSidebar tags={tagResource() as string[]} />
      </div>
    </div>
  );
};
