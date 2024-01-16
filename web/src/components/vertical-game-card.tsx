import { EllipsisText } from '@/components';

type VerticalGameCardProp = {
  user: string;
  title: string;
  img: string;
};
export const VerticalGameCard = (props: VerticalGameCardProp) => (
  <div class="flex items-center">
    <img
      class="rounded-t-lg p-4 w-40 h-24"
      src={props.img}
      alt="product image"
    />
    <div>
      <EllipsisText maxWidth="max-w-40" customStyle="font-bold text-lg">
        {props.title}
      </EllipsisText>
      <EllipsisText maxWidth="max-w-40" customStyle="text-sm text-gray-400">
        {' '}
        {props.user}
      </EllipsisText>
    </div>
  </div>
);
