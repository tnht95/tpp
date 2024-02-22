import { useParams } from '@solidjs/router';
import { batch, createResource, ErrorBoundary, Show } from 'solid-js';

import { deletePostAction, editPostAction, getPostByIdAction } from '@/apis';
import { LoadingSpinner, PostCard } from '@/components';
import { useToastCtx } from '@/context';
import { PostDetails, RespErr } from '@/models';
import { NotFound } from '@/pages';

export const PostDetailsPage = () => {
  const postId = useParams()['id'] as string;
  const { showToast } = useToastCtx();
  const [post, { mutate }] = createResource(postId, getPostByIdAction);

  const del = (postId: string) => {
    deletePostAction(postId)
      .then(() =>
        batch(() => {
          showToast({ msg: 'Post Deleted', type: 'ok' });
          window.history.back();
        })
      )
      .catch((error: RespErr) => showToast({ msg: error.msg, type: 'err' }));
  };

  const edit = (postId: string, content: string) => {
    editPostAction(postId, { content })
      .then(post =>
        batch(() => {
          showToast({ msg: 'Post Updated', type: 'ok' });
          mutate(post);
        })
      )
      .catch((error: RespErr) => showToast({ msg: error.msg, type: 'err' }));
  };
  return (
    <ErrorBoundary fallback={<NotFound />}>
      <Show when={post.state === 'ready'} fallback={<LoadingSpinner />}>
        <div class="mt-7 flex w-full justify-center">
          <div class="w-2/5">
            <PostCard
              post={post() as PostDetails}
              onDelete={del}
              onEdit={edit}
            />
          </div>
        </div>
      </Show>
    </ErrorBoundary>
  );
};
