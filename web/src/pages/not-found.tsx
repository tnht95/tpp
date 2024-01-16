import { Route } from '@solidjs/router';

import { Dashboard } from '@/pages';

export const NotFound = () => (
  <main class="h-[calc(100svh-4rem)] w-full flex flex-col justify-center items-center">
    <h1 class="text-9xl font-extrabold text-indigo-900 tracking-widest">404</h1>
    <div class="bg-yellow-300 text-white px-2 text-sm rounded rotate-12 absolute">
      Page Not Found
    </div>
    <button class="mt-5">
      <a class="relative inline-block text-sm font-medium text-yellow-300 group active:text-yellow-300 focus:outline-none focus:ring">
        <span class="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-yellow-300 group-hover:translate-y-0 group-hover:translate-x-0" />

        <span class="relative block px-8 py-3 bg-white border border-current">
          <Route path="/" component={Dashboard} />
          Go Home
        </span>
      </a>
    </button>
  </main>
);
