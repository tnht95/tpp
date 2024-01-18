import { CommentForm, Post, VerticalGameCard } from '@/components';

export const Dashboard = () => (
  <div class="flex ">
    <div class="flex flex-1 flex-col ">
      <div class="flex h-full ">
        <nav class="flex h-full w-2/6 border-r border-dashed" />
        <main class="mb-10 flex size-full flex-col bg-white px-32">
          <div class="mx-auto my-10 flex w-full">
            <CommentForm>New Post</CommentForm>
          </div>
          <div class="flex flex-col gap-10">
            <Post />
            <Post />
            <Post />
            <Post />
          </div>
        </main>
        <nav class="relative -z-10 flex h-full w-1/2 border-l border-dashed ">
          <div class="fixed mx-auto flex w-full flex-col overflow-y-auto px-6 ">
            <p class="mt-7 p-4 text-xl font-bold text-indigo-900">
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
