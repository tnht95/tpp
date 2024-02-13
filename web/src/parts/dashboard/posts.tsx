import { For, onCleanup, onMount, Show } from 'solid-js';

import { CommentForm, LoadingSpinner, PostCard } from '@/components';
import { usePostsCtx } from '@/context';
import { authenticationStore } from '@/store';

export const DashboardPosts = () => {
  const { utils } = authenticationStore;
  const {
    posts,
    utils: { handleScroll, loading },
    dispatch: { add, edit, del }
  } = usePostsCtx();
  onMount(() => {
    window.addEventListener('scroll', handleScroll);
  });
  onCleanup(() => {
    window.removeEventListener('scroll', handleScroll);
  });
  return (
    <div class="flex flex-col gap-10 py-10">
      <Show when={utils.isAuth()}>
        <CommentForm onSubmit={add}>New post</CommentForm>
      </Show>
      <div class="flex flex-col gap-10 ">
        <Show when={!loading()} fallback={<LoadingSpinner />}>
          <For each={posts}>
            {post => <PostCard post={post} onDelete={del} onEdit={edit} />}
          </For>
        </Show>
      </div>
    </div>
  );
};
