import { Button } from '@/components';

export const GameForm = () => (
  <div
    id="game-modal"
    tabindex="-1"
    aria-hidden="true"
    class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0  max-h-full hidden "
  >
    <div class="relative  w-1/2">
      <div class="relative bg-white rounded-xl shadow p-4">
        <div class="flex items-center justify-between p-6   rounded-t ">
          <div class="text-center font-bold text-2xl text-gray-700 ml-1">
            Upload your game
          </div>

          <button
            type="button"
            class="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
            data-modal-hide="game-modal"
          >
            <i class="fa-solid fa-xmark text-lg" />
            <span class="sr-only">Close modal</span>
          </button>
        </div>

        <form class="px-6">
          <div class="flex flex-col gap-5">
            <input
              placeholder="Game title"
              class="border placeholder-gray-400 rounded-xl w-full p-3"
            />
            <textarea
              id="postContent"
              name="postContent"
              rows="4"
              class="w-full border border-gray-200 rounded-xl py-2 leading-5 transition duration-150 ease-in-out resize-none placeholder-gray-400 focus:outline-none focus:border-blue-500"
              placeholder="Game discription"
            />
            <input
              placeholder="Game tags: separate each tag with a comma"
              class="placeholder-gray-400 border rounded-xl w-full p-3"
            />
            <div class="mb-6">
              <div class="relative border rounded-xl px-4 py-3 bg-white flex items-center justify-between hover:border-blue-500 transition duration-150 ease-in-out">
                <input
                  type="file"
                  id="fileAttachment"
                  name="fileAttachment"
                  class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div class="flex items-center">
                  <i class="fa-solid fa-plus text-lg text-gray-400" />
                  <span class="ml-2 text-gray-400">Upload your ROM file</span>
                </div>
                <span class="text-sm text-gray-300">Max file size: 4KB</span>
              </div>
              <Button
                title="Upload"
                modalTargetId="game-modal"
                customStyle="float-right mt-5 font-bold bg-indigo-900 text-white hover:bg-white hover:text-indigo-900"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
);