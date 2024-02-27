import { useNavigate } from '@solidjs/router';

export const NotFound = () => {
  const navigate = useNavigate();
  const goHome = () => {
    navigate('/', { replace: true });
  };
  return (
    <main class="flex h-[calc(100svh-4rem)] w-full select-none flex-col items-center justify-center">
      <h1 class="mt-10 text-9xl font-extrabold tracking-widest text-indigo-900">
        404
      </h1>
      <div class="absolute rotate-12 rounded bg-yellow-300 px-2 text-sm text-white">
        Page Not Found
      </div>
      <button>
        <a class="group relative inline-block text-sm font-medium text-yellow-300 focus:outline-none focus:ring active:text-yellow-300">
          <span class="absolute inset-0 translate-x-0.5 translate-y-0.5 bg-yellow-300 transition-transform group-hover:translate-x-0 group-hover:translate-y-0" />

          <div
            onClick={goHome}
            class="relative block border border-yellow-300 bg-white px-8 py-3 text-yellow-300 shadow-md shadow-yellow-300 hover:shadow-none"
          >
            Go Home
          </div>
        </a>
      </button>
    </main>
  );
};
