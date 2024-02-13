import { For, Show } from 'solid-js';

import { CommentCard, CommentForm } from '@/components';
import { useCommentsCtx } from '@/context';
import { authenticationStore } from '@/store';

export const CommentContainer = () => {
  const {
    utils: { isAuth }
  } = authenticationStore;
  const {
    comments,
    dispatch: { edit, del, add, fetchMore },
    utils: { showMore }
  } = useCommentsCtx();
  return (
    <div class="flex flex-col gap-5 pt-5">
      <For each={comments}>
        {comment => (
          <CommentCard comment={comment} onDelete={del} onEdit={edit} />
        )}
      </For>
      <Show when={showMore()}>
        <p
          onClick={fetchMore}
          class="-my-1 cursor-pointer text-gray-400 hover:text-gray-600"
        >
          Load more...
        </p>
      </Show>
      <Show when={isAuth()}>
        <CommentForm onSubmit={add}>New Comment</CommentForm>
      </Show>
    </div>
  );
};
