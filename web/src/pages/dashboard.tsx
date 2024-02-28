import { NewestGamesProvider, PostsProvider } from '@/context';
import { DashboardNewestGames, DashboardPosts } from '@/parts';

export const Dashboard = () => (
  <div class="flex">
    <nav class="flex-1" />
    <main class="flex-2 flex-col border-x border-dashed px-32 py-10">
      <PostsProvider>
        <DashboardPosts />
      </PostsProvider>
    </main>
    <nav class="flex-1">
      <div class="fixed flex-col overflow-hidden px-10">
        <p class="mt-7 p-4 text-xl font-bold text-indigo-900">Newest games</p>
        <div class="flex flex-col gap-5">
          <NewestGamesProvider>
            <DashboardNewestGames />
          </NewestGamesProvider>
        </div>
      </div>
    </nav>
  </div>
);
