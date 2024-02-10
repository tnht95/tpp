import { HeaderLogo } from './logo';
import { HeaderMenu } from './menu';
import { Searchbar } from './search-bar';
import { SignIn } from './sign-in';

export const Header = () => (
  <header class="sticky top-0 z-50 bg-indigo-900 px-10 text-white">
    <div class="flex gap-4">
      <HeaderLogo />
      <HeaderMenu />
      <Searchbar />
      <SignIn />
    </div>
  </header>
);
