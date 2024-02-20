import { HeaderLogo } from './logo';
import { HeaderMenu } from './menu';
import { HeaderSearchbar } from './search-bar';
import { HeaderSignIn } from './sign-in';

export const Header = () => (
  <header class="sticky top-0 z-50 bg-indigo-900 px-10 text-white">
    <div class="flex gap-4">
      <HeaderLogo />
      <HeaderMenu />
      <HeaderSearchbar />
      <HeaderSignIn />
    </div>
  </header>
);
