import { CommentForm } from '@/components';

export const Dashboard = () => (
  <div class="flex h-screen bg-green-300">
    <div class="flex-1 flex flex-col overflow-hidden">
      <div class="flex h-full">
        <nav class="flex w-2/6 h-full " />
        <main class="flex flex-col h-full w-full bg-white overflow-x-hidden overflow-y-auto ">
          <div class="flex w-full mx-auto px-6 py-8">
            <CommentForm />
          </div>
        </main>
        <nav class="flex w-1/2 h-full bg-yellow-400">
          <div class="w-full flex mx-auto px-6 py-8" />
        </nav>
      </div>
    </div>
  </div>
);
