import { createResource, For } from 'solid-js';

import { addPostAction, fetchNewestGameAction, fetchPostAction } from '@/apis';
import { CommentForm, PostCard, VerticalGameCard } from '@/components';
import { useAuth } from '@/context';

export const Dashboard = () => {
  const [games] = createResource(fetchNewestGameAction);
  const [post, { mutate }] = createResource(fetchPostAction);
  const { utils } = useAuth();

  const onSubmitHandler = (content: string) => {
    addPostAction({ content })
      .then(newPost => mutate([newPost, ...(post() || [])]))
      .catch(() => {});
  };

  return (
    <div class="flex">
      <div class="flex flex-1 flex-col">
        <div class="flex h-full">
          <nav class="flex h-full w-2/6 border-r border-dashed" />
          <main class="mb-10 flex size-full flex-col bg-white px-32">
            <div class="mx-auto my-10 flex w-full">
              {utils.isAuth() && (
                <CommentForm onSubmitHandler={onSubmitHandler}>
                  New Post
                </CommentForm>
              )}
            </div>
            <div class="flex flex-col gap-10">
              <For each={post()}>
                {post => <PostCard content={post.content} />}
              </For>
            </div>
          </main>
          <nav class="relative -z-10 flex h-full w-1/2 border-l border-dashed">
            <div class="fixed mx-auto flex w-full flex-col overflow-y-auto px-6">
              <p class="mt-7 p-4 text-xl font-bold text-indigo-900">
                Newest games
              </p>
              <div class="flex flex-col gap-5">
                <For each={games()}>
                  {game => (
                    <VerticalGameCard
                      user={game.author_name}
                      name={game.name}
                      img={game.avatar_url}
                    />
                  )}
                </For>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};
