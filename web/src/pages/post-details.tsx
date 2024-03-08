import { useParams } from '@solidjs/router';
import {
  batch,
  createEffect,
  createResource,
  createSignal,
  ErrorBoundary,
  Show
} from 'solid-js';

import { deletePostAction, editPostAction, getPostByIdAction } from '@/apis';
import { LoadingSpinner, PostCard } from '@/components';
import { useToastCtx } from '@/context';
import { PostDetails } from '@/models';
import { NotFound } from '@/pages';

export const PostDetailsPage = () => {
  const [postId, setPostId] = createSignal<string>(useParams()['id'] as string);
  const { showToast } = useToastCtx();
  const [post, { mutate }] = createResource(postId, getPostByIdAction);

  createEffect(() => {
    setPostId(useParams()['id'] as string);
  });

  const del = (postId: string) => {
    deletePostAction(postId)
      .then(() =>
        batch(() => {
          showToast({ message: 'Post Deleted', type: 'ok' });
          window.history.back();
        })
      )
      .catch(({ message }: Error) => showToast({ message, type: 'err' }));
  };

  const edit = (postId: string, content: string) => {
    editPostAction(postId, { content })
      .then(post =>
        batch(() => {
          showToast({ message: 'Post Updated', type: 'ok' });
          mutate(post);
        })
      )
      .catch(({ message }: Error) => showToast({ message, type: 'err' }));
  };
  return (
    <Show when={!post.loading} fallback={<LoadingSpinner />}>
      <ErrorBoundary fallback={<NotFound />}>
        <div class="mt-7 flex w-full justify-center">
          <div class="w-2/5">
            <Show when={post()}>
              <PostCard
                post={post() as PostDetails}
                onDelete={del}
                onEdit={edit}
              />
            </Show>
          </div>
        </div>
      </ErrorBoundary>
    </Show>
  );
};
