import { UserDetailsProvider, UserGamesProvider } from '@/context';
import { UserActivity, UserGames, UserInfo } from '@/parts';

export const UserDetails = () => (
  <UserDetailsProvider>
    <div class="flex gap-14 p-10">
      <div class="w-1/4">
        <UserInfo />
      </div>
      <div class="flex flex-1 flex-col gap-10">
        <UserGamesProvider>
          <UserGames />
        </UserGamesProvider>
        <UserActivity />
      </div>
    </div>
    <div />
  </UserDetailsProvider>
);
