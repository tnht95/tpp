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
      <p class="font-bold text-lg">{props.title}</p>
      <p class="text-sm text-gray-400">by {props.user}</p>
    </div>
  </div>
);
