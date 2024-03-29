import { useNavigate } from '@solidjs/router';

import { EllipsisText } from '@/components';

type Props = {
  name: string;
};
export const Tag = (props: Props) => {
  const navigate = useNavigate();

  const navigateToSearchPage = () => {
    navigate(`/tags/${encodeURIComponent(props.name)}`);
  };
  return (
    <div
      class="group relative inline-block cursor-pointer py-1 text-sm"
      onClick={navigateToSearchPage}
    >
      <div class="absolute inset-0 flex text-indigo-200 group-hover:text-indigo-300">
        <svg height="100%" viewBox="0 0 50 100">
          <path
            d="M49.9,0a17.1,17.1,0,0,0-12,5L5,37.9A17,17,0,0,0,5,62L37.9,94.9a17.1,17.1,0,0,0,12,5ZM25.4,59.4a9.5,9.5,0,1,1,9.5-9.5A9.5,9.5,0,0,1,25.4,59.4Z"
            fill="currentColor"
            class="group-hover:fill-indigo-900"
          />
        </svg>
        <div class="-ml-px h-full grow rounded-md rounded-l-none bg-indigo-200 group-hover:bg-indigo-900" />
      </div>
      <span class="relative flex items-center p-0.5 pr-px font-semibold uppercase text-indigo-500 group-hover:text-white">
        <EllipsisText maxWidth="max-w-80" customStyle="ml-2 px-2">
          {props.name}
        </EllipsisText>
      </span>
    </div>
  );
};
