import { For, Show } from 'solid-js';

import { CommentContainer, CommentForm } from '@/components';
import { useCommentsCtx } from '@/context';

export const GameDetailsDiscussionDetailsComment = () => {
  const {
    comments,
    dispatch: { edit, del, add, fetchMore },
    utils: { showMore }
  } = useCommentsCtx();
  return (
    <div class="flex flex-col gap-10">
      <For each={comments}>
        {comment => (
          <CommentContainer comment={comment} onDelete={del} onEdit={edit} />
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
      <CommentForm onSubmitHandler={add}>New Comment</CommentForm>
    </div>
  );
};
