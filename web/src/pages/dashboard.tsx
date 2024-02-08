import {
  batch,
  createEffect,
  createResource,
  createSignal,
  For,
  onCleanup,
  onMount,
  Show
} from 'solid-js';
import { createStore, produce } from 'solid-js/store';

import {
  addPostAction,
  deletePostAction,
  editPostAction,
  fetchGameAction,
  fetchPostAction
} from '@/apis';
import {
  CommentForm,
  LoadingSpinner,
  PostCard,
  VerticalGameCard
} from '@/components';
import { OFFSET } from '@/constant';
import { useAuthCtx, useToastCtx } from '@/context';
import { PostDetails, ResponseErr } from '@/models';

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
  const [posts, setPosts] = createStore<PostDetails[]>([]);
  const [hasReachedBottom, setHasReachedBottom] = createSignal(false);

  createEffect(() => {
    if (postResource().length > 0) {
      batch(() => {
        setPosts(produce(oldPost => oldPost.push(...postResource())));
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

  const resetPosts = () =>
    batch(() => {
      setPosts([]);
      if (currentOffset() === 0) refetch() as unknown;
      else setCurrentOffset(0);
    });

  const onSubmitHandler = (content: string) =>
    addPostAction({ content })
      .then(resetPosts)
      .then(() => dispatch.showToast({ msg: 'Post Added', type: 'Ok' }))
      .catch((error: ResponseErr) =>
        dispatch.showToast({ msg: error.msg, type: 'Err' })
      ) as unknown;

  const onDeleteHandler = (postId: string) =>
    deletePostAction(postId)
      .then(resetPosts)
      .then(() => dispatch.showToast({ msg: 'Post Deleted', type: 'Ok' }))
      .catch((error: ResponseErr) =>
        dispatch.showToast({ msg: error.msg, type: 'Err' })
      ) as unknown;

  const onEditHandler = (postId: string, content: string) =>
    editPostAction(postId, { content })
      .then(post => setPosts(p => p.id === post.id, post))
      .catch((error: ResponseErr) =>
        dispatch.showToast({ msg: error.msg, type: 'Err' })
      ) as unknown;

  return (
    <div class="flex h-full">
      <nav class="flex-2" />
      <main class="mb-10 flex-3 flex-col border-x border-dashed px-32">
        <div class="my-10">
          {utils.isAuth() && (
            <CommentForm onSubmitHandler={onSubmitHandler}>
              New post
            </CommentForm>
          )}
        </div>
        <div class="flex flex-col gap-10 ">
          <Show when={!postResource.loading} fallback={<LoadingSpinner />}>
            <For each={posts}>
              {post => (
                <PostCard
                  post={post}
                  onDelete={onDeleteHandler}
                  onEdit={onEditHandler}
                />
              )}
            </For>
          </Show>
        </div>
      </main>
      <nav class="flex flex-2">
        <div class="fixed flex-col overflow-hidden px-10">
          <p class="mt-7 p-4 text-xl font-bold text-indigo-900">Newest games</p>
          <div class="flex flex-col gap-5">
            <Show when={!newestGames.loading} fallback={<LoadingSpinner />}>
              <For each={newestGames()}>
                {game => <VerticalGameCard game={game} />}
              </For>
            </Show>
          </div>
        </div>
      </nav>
    </div>
  );
};
