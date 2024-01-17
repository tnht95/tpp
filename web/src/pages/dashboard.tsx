import { CommentForm, Post, VerticalGameCard } from '@/components';

export const Dashboard = () => (
  <div class="flex  ">
    <div class="flex-1 flex flex-col  ">
      <div class="flex h-full ">
        <nav class="flex w-2/6 h-full border-r border-dashed" />
        <main class="flex flex-col  h-full w-full bg-white px-32 mb-10">
          <div class="flex w-full mx-auto my-10">
            <CommentForm>New Post</CommentForm>
          </div>
          <div class="flex flex-col gap-10">
            <Post />
          </div>
        </main>
        <nav class="flex w-1/2 h-full border-l border-dashed  relative -z-10 ">
          <div class="w-full flex flex-col mx-auto px-6 fixed overflow-y-auto ">
            <p class="text-xl font-bold p-4 mt-7 text-indigo-900">
              Newest games
            </p>
            <div class="flex flex-col gap-5">
              <VerticalGameCard
                user="Jen@gmai.comjhvhjv hvhmvh mvhvhmv"
                title="Space Invaderhnvhmvhvhgcvhngcgbcgc"
                img="https://ajor.co.uk/images/chip8/super-spacefig.png"
              />
              <VerticalGameCard
                user="Jen@gmai.com"
                title="Space Invader"
                img="https://ajor.co.uk/images/chip8/super-spacefig.png"
              />
              <VerticalGameCard
                user="Jen@gmai.com"
                title="Space Invader"
                img="https://ajor.co.uk/images/chip8/super-spacefig.png"
              />
              <VerticalGameCard
                user="Jen@gmai.com"
                title="Space Invader"
                img="https://ajor.co.uk/images/chip8/super-spacefig.png"
              />
              <VerticalGameCard
                user="Jen@gmai.com"
                title="Space Invader"
                img="https://ajor.co.uk/images/chip8/super-spacefig.png"
              />
            </div>
          </div>
        </nav>
      </div>
    </div>
  </div>
);
