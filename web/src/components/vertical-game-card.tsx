import { EllipsisText } from '@/components';

type VerticalGameCardProp = {
  user: string;
  name: string;
  img: string;
};
export const VerticalGameCard = (props: VerticalGameCardProp) => (
  <div class="flex items-center">
    <img
      class="h-24 w-40 rounded-t-lg p-4"
      src={props.img}
      alt="product image"
    />
    <div>
      <EllipsisText maxWidth="max-w-40" customStyle="font-bold text-lg">
        {props.name}
      </EllipsisText>
      <EllipsisText maxWidth="max-w-40" customStyle="text-sm text-gray-400">
        {' '}
        {props.user}
      </EllipsisText>
    </div>
  </div>
);
