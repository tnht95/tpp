import { NewestGamesProvider, PostsProvider } from '@/context';
import { NewestGames, Posts } from '@/parts';

export const Dashboard = () => (
  <div class="flex">
    <nav class="flex-2" />
    <main class="flex-3 flex-col border-x border-dashed px-32">
      <PostsProvider>
        <Posts />
      </PostsProvider>
    </main>
    <nav class="flex-2">
      <div class="fixed flex-col overflow-hidden px-10">
        <p class="mt-7 p-4 text-xl font-bold text-indigo-900">Newest games</p>
        <div class="flex flex-col gap-5">
          <NewestGamesProvider>
            <NewestGames />
          </NewestGamesProvider>
        </div>
      </div>
    </nav>
  </div>
);
