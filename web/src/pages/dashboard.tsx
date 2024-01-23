import { CommentForm, Post, VerticalGameCard } from '@/components';
import { createResource, For } from 'solid-js';
import { Game, Reponse } from '@/models';

const fetchNewestGame = (): Promise<Reponse<Game[]>> =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/newest_games`)
    .then(r => r.json())
    .catch(() => {}) as Promise<Reponse<Game[]>>;

export const Dashboard = () =>  {
  const [games] = createResource(fetchNewestGame);

  return (
    <div class="flex">
      <div class="flex flex-1 flex-col">
        <div class="flex h-full">
          <nav class="flex h-full w-2/6 border-r border-dashed" />
          <main class="mb-10 flex size-full flex-col bg-white px-32">
            <div class="mx-auto my-10 flex w-full">
              <CommentForm>New Post</CommentForm>
            </div>
            <div class="flex flex-col gap-10">
              <Post />
              <Post />
              <Post />
              <Post />
            </div>
          </main>
          <nav class="relative -z-10 flex h-full w-1/2 border-l border-dashed">
            <div class="fixed mx-auto flex w-full flex-col overflow-y-auto px-6">
              <p class="mt-7 p-4 text-xl font-bold text-indigo-900">
                Newest games
              </p>
              <div class="flex flex-col gap-5">
                <For each={games()?.data}>
                  {game => (
                    <VerticalGameCard
                      user={game.author_name}
                      name={game.name}
                      img={game.avatar_url}
                    />
                  )}
                </For>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  )
};

