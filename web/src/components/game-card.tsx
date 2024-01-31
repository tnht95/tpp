import { EllipsisText } from '@/components';

type GameCardProps = {
  id: string;
  name: string;
  byUser: string;
  stars: number;
  img: string;
};
export const GameCard = (props: GameCardProps) => (
  <div class="w-40 rounded-lg border bg-indigo-300 shadow-md hover:bg-white">
    <a href={`/games/${props.id}/info`}>
      <img
        class="h-24 w-60 rounded-t-lg p-4"
        src={props.img}
        alt="product image"
      />
      <div class="pb-2 pl-5">
        <EllipsisText
          maxWidth="max-w-28"
          customStyle="text-indigo-900 font-bold text-xs"
        >
          {props.name}
        </EllipsisText>
        <EllipsisText maxWidth="max-w-28" customStyle="text-xs text-indigo-700">
          {props.byUser}
        </EllipsisText>
        <div class="mb-5 mt-2.5 flex items-center">
          <div class="flex items-center rounded bg-indigo-500 px-2.5 py-1">
            <span class="text-xs font-semibold text-white">
              <i class="fa-solid fa-star pr-1 text-xs text-yellow-400" />
              {props.stars}
            </span>
          </div>
        </div>
      </div>
    </a>
  </div>
);
