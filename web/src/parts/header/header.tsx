import { HeaderLogo } from './header-logo';
import { HeaderMenu } from './header-menu';
import { Searchbar } from './search-bar';
import { SignIn } from './sign-in';

export const Header = () => (
  <header class="sticky top-0 z-50 bg-indigo-900 px-7 text-white">
    <div class="flex gap-4">
      <HeaderLogo />
      <HeaderMenu />
      <Searchbar />
      <SignIn />
    </div>
  </header>
);
