type GameCardProps = {
  gameTitle: string;
  byUser: string;
  stars: number;
  img: string;
};
export const GameCard = (props: GameCardProps) => (
  <div class=" w-36 bg-indigo-300 shadow-md rounded-lg hover:bg-white border-2 hover:border-indigo-900">
    <a href="">
      <img
        class="rounded-t-lg p-4 w-60 h-24"
        src={props.img}
        alt="product image"
      />
      <div class="px-5 pb-2">
        <h3 class="text-indigo-900 font-bold text-xs ">{props.gameTitle}</h3>
        <div class="text-xs text-indigo-700">{props.byUser}</div>
        <div class="flex items-center mt-2.5 mb-5">
          <div class="bg-indigo-500 items-center rounded px-2.5 py-1 flex ">
            <span class=" text-white text-xs font-semibold">
              <i class="fa-solid fa-star text-yellow-400 text-xs pr-1" />
              {props.stars}
            </span>
          </div>
        </div>
      </div>
    </a>
  </div>
);
