import { BlogPost, GameCard, ShowMoreButton, UserCard } from '@/components';

export const Search = () => (
  <div class="flex ">
    <div class="flex-1 flex flex-col ">
      <div class="flex h-full ">
        <nav class="flex w-2/6 h-full border-r border-dashed" />
        <main class="flex flex-col h-full w-full bg-white px-32 gap-7 mt-10">
          <p class="text-indigo-900 font-bold text-2xl">Result for "Game":</p>
          <div class="flex flex-col ">
            <div>
              <p class="text-indigo-900 font-bold text-xl mb-5">
                <i class="fa-solid fa-gamepad mr-2" />
                Games:
              </p>
              <div class="flex gap-5">
                <GameCard
                  gameTitle="Space Invader"
                  byUser="N@gmail.com"
                  stars={2}
                  img="https://ajor.co.uk/images/chip8/super-alien.png"
                />
                <GameCard
                  gameTitle="Balls"
                  byUser="N@gmail.com"
                  stars={2}
                  img="https://ajor.co.uk/images/chip8/super-alien.png"
                />

                <GameCard
                  gameTitle="This is a long name"
                  byUser="N@gmail.com"
                  stars={2}
                  img="https://ajor.co.uk/images/chip8/super-alien.png"
                />
                <GameCard
                  gameTitle="Balls"
                  byUser="N@gmail.comcscscsfcsfsdfsf"
                  stars={2}
                  img="https://ajor.co.uk/images/chip8/super-alien.png"
                />
                <ShowMoreButton />
              </div>
            </div>
          </div>
          <div>
            <p class="text-indigo-900 font-bold text-xl mb-5">
              <i class="fa-solid fa-users mr-2" />
              Users:
            </p>
            <div class="flex gap-5">
              <UserCard />
              <UserCard />

              <UserCard />
              <ShowMoreButton />
            </div>
          </div>
          <div>
            <p class="text-indigo-900 font-bold text-xl mb-5">
              <i class="fa-solid fa-highlighter mr-2" />
              Posts:
            </p>
            <div class=" flex flex-col gap-7">
              <p class="text-center text-lg text-gray-400">
                {' '}
                -- Nothing to show --
              </p>
            </div>
          </div>
          <div>
            <p class="text-indigo-900 font-bold text-xl mb-5">
              <i class="fa-solid fa-cube mr-2" />
              Blogs:
            </p>
            <div class="flex flex-col gap-5">
              <BlogPost />
              <BlogPost />
              <BlogPost />
              <BlogPost />
              <ShowMoreButton vertical />
            </div>
          </div>
        </main>
        <nav class="flex w-1/2 h-full border-l border-dashed relative -z-10 " />
      </div>
    </div>
  </div>
);
