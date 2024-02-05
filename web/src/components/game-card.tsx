import { EllipsisText } from '@/components';
import { GameSummary } from '@/models';

type GameCardProps = {
  game: GameSummary;
};
export const GameCard = (props: GameCardProps) => (
  <div class="w-48 rounded-lg border bg-indigo-300 shadow-md hover:bg-white">
    <a href={`/games/${props.game.id}/info`}>
      <img
        class="h-28 w-60 rounded-t-lg p-4"
        src={
          props.game.avatarUrl ||
          'https://jacopofarina.eu/static/img/chip_8_screenshot.png'
        }
        alt="product image"
      />
      <div class="px-5 pb-2">
        <EllipsisText
          maxWidth="max-w-28"
          customStyle="text-indigo-900 font-bold text-sm"
        >
          {props.game.name}
        </EllipsisText>
        <EllipsisText maxWidth="max-w-28" customStyle="text-xs text-indigo-700">
          {props.game.authorName}
        </EllipsisText>
        <div class="mb-5 mt-2.5 flex items-center gap-1 text-sm">
          <div class="flex items-center rounded bg-indigo-500 px-2.5 py-0.5">
            <span class="font-semibold text-white">
              <i class="fa-solid fa-angle-up pr-1 text-green-400" />
              {props.game.upVotes}
            </span>
          </div>
          <div class="flex items-center rounded bg-indigo-500 px-2.5 py-0.5">
            <span class="font-semibold text-white">
              <i class="fa-solid fa-angle-down pr-1 text-red-400" />
              {props.game.downVotes}
            </span>
          </div>
        </div>
      </div>
    </a>
  </div>
);
