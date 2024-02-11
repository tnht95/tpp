import { For, onCleanup, onMount } from 'solid-js';

import { CommentForm, PostCard } from '@/components';
import { usePostsCtx } from '@/context';
import { authenticationStore } from '@/store';

export const Posts = () => {
  const { utils } = authenticationStore;
  const {
    posts,
    utils: { handleScroll },
    dispatch: { add, edit, del }
  } = usePostsCtx();
  onMount(() => {
    window.addEventListener('scroll', handleScroll);
  });
  onCleanup(() => {
    window.removeEventListener('scroll', handleScroll);
  });
  return (
    <main class="mb-10 flex-3 flex-col border-x border-dashed px-32">
      <div class="my-10">
        {utils.isAuth() && (
          <CommentForm onSubmitHandler={add}>New post</CommentForm>
        )}
      </div>
      <div class="flex flex-col gap-10 ">
        <For each={posts}>
          {post => <PostCard post={post} onDelete={del} onEdit={edit} />}
        </For>
      </div>
    </main>
  );
};
