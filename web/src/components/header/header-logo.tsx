import { alienLogo } from '@/assets';

export const HeaderLogo = () => (
  <a href="/" class="mr-5 flex items-center justify-center">
    <img class="h-12" src={alienLogo} alt="logo" />
    <span class="ml-4 text-sm font-black uppercase">
      The Pixel
      <br />
      playground
    </span>
  </a>
);
