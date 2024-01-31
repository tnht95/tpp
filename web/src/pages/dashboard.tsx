import {
  batch,
  createEffect,
  createResource,
  createSignal,
  For,
  onCleanup,
  onMount
} from 'solid-js';
import { createStore, produce } from 'solid-js/store';

import {
  addPostAction,
  deletePostAction,
  editPostAction,
  fetchGameAction,
  fetchPostAction
} from '@/apis';
import { CommentForm, PostCard, VerticalGameCard } from '@/components';
import { OFFSET } from '@/constant';
import { useAuthCtx, useToastCtx } from '@/context';
import { Post, ResponseErr } from '@/models';

export const Dashboard = () => {
  const { utils } = useAuthCtx();
  const { dispatch } = useToastCtx();
  const [newestGames] = createResource(
    { orderField: 'createdAt', orderBy: 'desc', limit: 5 },
    fetchGameAction
  );
  const [currentOffset, setCurrentOffset] = createSignal(0);
  const [postResource, { refetch }] = createResource(
    currentOffset,
    fetchPostAction,
    {
      initialValue: []
    }
  );
  const [post, setPost] = createStore<Post[]>(postResource());
  const [hasReachedBottom, setHasReachedBottom] = createSignal(false);

  createEffect(() => {
    if (postResource().length > 0) {
      batch(() => {
        setPost(produce(oldPost => oldPost.push(...postResource())));
        setHasReachedBottom(false);
      });
    }
  });

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
    if (scrollPercentage > 90 && !hasReachedBottom()) {
      batch(() => {
        setCurrentOffset(offset => offset + OFFSET);
        setHasReachedBottom(true);
      });
    }
  };

  onMount(() => {
    window.addEventListener('scroll', handleScroll);
  });
  onCleanup(() => {
    window.removeEventListener('scroll', handleScroll);
  });

  const batchSubmitHandler = () =>
    batch(() => {
      setPost([]);
      if (currentOffset() === 0) refetch() as unknown;
      else setCurrentOffset(0);
    });

  const onSubmitHandler = (content: string) =>
    addPostAction({ content })
      .then(batchSubmitHandler)
      .catch((error: ResponseErr) => dispatch.showToast(error.msg)) as unknown;

  const onDeleteHandler = (postId: string) =>
    deletePostAction(postId)
      .then(batchSubmitHandler)
      .catch((error: ResponseErr) => dispatch.showToast(error.msg)) as unknown;

  const onEditHandler = (postId: string, content: string) =>
    editPostAction(postId, { content })
      // .then(batchSubmitHandler)
      .catch((error: ResponseErr) => dispatch.showToast(error.msg)) as unknown;

  return (
    <div class="flex">
      <div class="flex flex-1 flex-col">
        <div class="flex h-full">
          <nav class="flex h-full w-1/2 border-r border-dashed" />
          <main class="mb-10 flex size-full flex-col bg-white px-32">
            <div class="mx-auto my-10 flex w-full">
              {utils.isAuth() && (
                <CommentForm onSubmitHandler={onSubmitHandler}>
                  New post
                </CommentForm>
              )}
            </div>
            <div class="flex flex-col gap-10 ">
              <For each={post}>
                {post => (
                  <PostCard
                    post={post}
                    onDelete={onDeleteHandler}
                    onEdit={onEditHandler}
                  />
                )}
              </For>
            </div>
          </main>
          <nav class="flex h-full w-1/2 border-l border-dashed ">
            <div class="fixed mx-auto flex w-full flex-col overflow-y-auto px-6">
              <p class="mt-7 p-4 text-xl font-bold text-indigo-900">
                Newest games
              </p>
              <div class="flex flex-col gap-5">
                <For each={newestGames()}>
                  {game => <VerticalGameCard game={game} />}
                </For>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};
