export const Tag = () => (
  <div class="inline-block relative py-1 text-sm group">

    <div class="absolute inset-0 text-indigo-200 flex group-hover:text-indigo-300 ">
      <svg height="100%" viewBox="0 0 50 100">
        <path
          d="M49.9,0a17.1,17.1,0,0,0-12,5L5,37.9A17,17,0,0,0,5,62L37.9,94.9a17.1,17.1,0,0,0,12,5ZM25.4,59.4a9.5,9.5,0,1,1,9.5-9.5A9.5,9.5,0,0,1,25.4,59.4Z"
          fill="currentColor" class="group-hover:fill-indigo-900"
        />
      </svg>
      <div class="flex-grow h-full -ml-px bg-indigo-200 group-hover:bg-indigo-900 rounded-md rounded-l-none " />
    </div>
    <span class="relative text-indigo-500 group-hover:text-white uppercase font-semibold pr-px cursor-pointer">
      <a> <span class="ml-2 px-2">tag name</span> </a>
    </span>
  </div>
);
