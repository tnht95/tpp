import { EllipsisText } from '@/components';
import { GameSummary } from '@/models';

type Props = {
  game: GameSummary;
};

export const VerticalGameCard = (props: Props) => (
  <div class="flex items-center">
    <img
      class="h-24 w-40 rounded-t-lg p-4"
      src={
        props.game.avatarUrl ||
        'https://jacopofarina.eu/static/img/chip_8_screenshot.png'
      }
      alt={`${props.game.name} img`}
    />
    <div class="flex flex-col">
      <a href={`/games/${props.game.id}/info`}>
        <EllipsisText
          maxWidth="max-w-40"
          customStyle="font-bold text-lg hover:text-indigo-700"
        >
          {props.game.name}
        </EllipsisText>
      </a>
      <a href={`/users/${props.game.authorId}`}>
        <EllipsisText
          maxWidth="max-w-40"
          customStyle="text-sm text-gray-400 hover:text-indigo-700"
        >
          {props.game.authorName}
        </EllipsisText>
      </a>
    </div>
  </div>
);
