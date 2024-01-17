import { GameTab, OptionButton, PillButton } from '@/components';

export const GameDetailsTabs = () => (
  <div class="px-6 mt-4 overflow-x-hidden lg:px-10">
    <div class="flex flex-row ">
      <div class="flex items-center w-7/10">
        <i class="fa-solid fa-puzzle-piece text-indigo-900 text-xl mr-2" />
        <div class="text-2xl font-medium text-indigo-900 cursor-pointer hover:underline mr-3">
          tailwindcss
        </div>
        <OptionButton id="gameinfo" isOwner={true} />
      </div>

      <div class="flex ">
        <div class="flex gap-x-5">
          <PillButton icon="fa-solid fa-plus" title="Subcribe" number={345} />
          <PillButton title="Star" number={2123} icon="fa-solid fa-star" />
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between px-10 mt-6 -mx-10 border-b select-none">
      <div class="flex">
        <GameTab
          title="Info"
          url="/games/:id/info"
          icon="fa-regular fa-lightbulb"
        />
        <GameTab
          title="Discussion"
          url="/games/:id/discussion"
          icon="fa-regular fa-comment-dots"
        />
        <GameTab
          title="Activity"
          url="/games/:id/activity"
          icon="fa-regular fa-rectangle-list"
        />
      </div>
    </div>
  </div>
);
