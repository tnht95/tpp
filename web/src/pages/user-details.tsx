import { Activity, GameCard, PillButton } from '@/components';

export const UserDetails = () => (
  <div class=" ml-10  my-5 p-5">
    <div class="md:flex no-wrap md:-mx-2 ">
      <div class="w-full md:w-3/12 md:mx-2">
        <div class=" w-full group max-w-md min-w-0  mt-6 mb-6 break-words bg-white border rounded-xl">
          <div>
            <div class="flex flex-wrap justify-center">
              <div class="flex justify-center w-full">
                <div class="relative">
                  <img
                    src="https://source.unsplash.com/jmURdhtm7Ng/120x120"
                    class="dark:shadow-xl border-white dark:border-gray-800 rounded-full align-middle border-8 absolute -m-16 -ml-18 lg:-ml-16 max-w-[150px]"
                    alt="d"
                  />
                </div>
              </div>
            </div>
            <div class="mt-20 text-center flex justify-center  ">
              <h3 class="text-2xl font-bold leading-normal text-gray-700 dark:text-gray-300">
                Ariel Cerda
              </h3>
            </div>
            <div class="flex flex-col items-center justify-center">
              <div class=" text-sm text-gray-500">
                <i class="fa-solid fa-link" />
                <a href="">github.com/iota</a>
              </div>
            </div>
            <div class="pt-6 mx-6 mt-6 text-center border-t border-gray-200 ">
              <div class="flex flex-wrap justify-center mb-4">
                <PillButton
                  title="Subscribe"
                  icon="fa-solid fa-plus"
                  number={30}
                />
              </div>
            </div>
          </div>
        </div>
        <div />
      </div>
      <div class="w-4/6 ml-10 mt-6 ">
        <div class="bg-white pl-8 pt-3 pb-7 border rounded-xl">
          <div class="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-5">
            <i class="fa-regular fa-paper-plane text-lg text-green-400" />
            <span class="tracking-wide">Games</span>
          </div>

          <div class="flex gap-7 flex-wrap">
            <GameCard
              gameTitle="Bob"
              byUser="Harry"
              stars={35}
              img={'https://i.ytimg.com/vi/73lnG3ArcDg/hqdefault.jpg'}
            />

            <GameCard
              gameTitle="Bob"
              byUser="Harry"
              stars={35}
              img={'https://i.ytimg.com/vi/73lnG3ArcDg/hqdefault.jpg'}
            />

            <GameCard
              gameTitle="Bob"
              byUser="Harry"
              stars={35}
              img={'https://i.ytimg.com/vi/73lnG3ArcDg/hqdefault.jpg'}
            />
            <GameCard
              gameTitle="Bob"
              byUser="Harry"
              stars={35}
              img={'https://i.ytimg.com/vi/73lnG3ArcDg/hqdefault.jpg'}
            />
            <GameCard
              gameTitle="Bob"
              byUser="Harry"
              stars={35}
              img={'https://i.ytimg.com/vi/73lnG3ArcDg/hqdefault.jpg'}
            />

            <GameCard
              gameTitle="Bob"
              byUser="Harry"
              stars={35}
              img={'https://i.ytimg.com/vi/73lnG3ArcDg/hqdefault.jpg'}
            />

            <GameCard
              gameTitle="Bob"
              byUser="Harry"
              stars={35}
              img={'https://i.ytimg.com/vi/73lnG3ArcDg/hqdefault.jpg'}
            />

            <GameCard
              gameTitle="Bob"
              byUser="Harry"
              stars={35}
              img={'https://i.ytimg.com/vi/73lnG3ArcDg/hqdefault.jpg'}
            />

            <GameCard
              gameTitle="Bob"
              byUser="Harry"
              stars={35}
              img={'https://i.ytimg.com/vi/73lnG3ArcDg/hqdefault.jpg'}
            />
          </div>
        </div>

        <div class="my-4" />

        <div class="bg-white p-3 border rounded-xl">
          <div class="px-8 pt-3 pb-7">
            <div class=" items-center space-x-2 font-semibold text-gray-900 leading-8 mb-5">
              <i class="fa-regular fa-newspaper text-lg text-green-400" />
              <span class="tracking-wide">Activity</span>
            </div>
            <div class="">
              <Activity title="Bob upload this game" date="09 Jun 2023" />
              <Activity title="Bob upload this game" date="09 Jun 2023" />

              <Activity title="Bob upload this game" date="09 Jun 2023" />

              <Activity title="Bob upload this game" date="09 Jun 2023" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
