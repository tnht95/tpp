import { PostsProvider } from '@/context';
import { NewestGames, Posts } from '@/parts';

export const Dashboard = () => (
  <div class="flex">
    <nav class="flex-2" />
    <PostsProvider>
      <Posts />
    </PostsProvider>
    <NewestGames />
  </div>
);
