import { alienLogo } from '@/assets';

export const HeaderLogo = () => (
  <a href="/" class="flex items-center justify-center gap-4">
    <img class="h-12" src={alienLogo} alt="logo" />
    <span class="text-sm font-black uppercase">
      The Pixel
      <br />
      playground
    </span>
  </a>
);
