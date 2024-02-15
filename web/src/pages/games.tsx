import { createResource } from 'solid-js';

import { fetchGameTagsAction } from '@/apis';
import { GamesProvider } from '@/context';
import { GameList, TagSidebar } from '@/parts';

export const Games = () => {
  const [tagResource] = createResource(fetchGameTagsAction);
  return (
    <div class="flex justify-between p-10">
      <GamesProvider>
        <GameList />
      </GamesProvider>
      <div class="w-1/6">
        <TagSidebar tags={tagResource()} loading={() => tagResource.loading} />
      </div>
    </div>
  );
};
