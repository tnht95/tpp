export const Gamecard = () => (
  <div class=" w-36 bg-indigo-300 shadow-md rounded-lg hover:bg-white border-2 hover:border-indigo-900">
    <a href="">
      <img
        class="rounded-t-lg p-4 w-60 h-24"
        src="https://ajor.co.uk/images/chip8/connect4.png"
        alt="product image"
      />
      <div class="px-5 pb-2">
        <h3 class="text-indigo-900 font-bold text-xs ">Apple Watch Series 7</h3>
        <div class="text-xs text-indigo-700">This is a context</div>
        <div class="flex items-center mt-2.5 mb-5">
          <div class="bg-indigo-500 items-center rounded px-2.5 py-1 flex ">
            <span class=" text-white text-xs font-semibold  ">
              5.0
              <i class="fa-solid fa-star text-yellow-400 text-xs pl-1" />
            </span>
          </div>
        </div>
      </div>
    </a>
  </div>
);
