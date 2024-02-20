import { UserDetailsProvider, UserGamesProvider } from '@/context';
import { UserDetailsGames, UserDetailsInfo } from '@/parts';

export const UserDetails = () => (
  <UserDetailsProvider>
    <div class="flex gap-14 p-10">
      <div class="w-1/4">
        <UserDetailsInfo />
      </div>
      <UserGamesProvider>
        <UserDetailsGames />
      </UserGamesProvider>
    </div>
    <div />
  </UserDetailsProvider>
);
