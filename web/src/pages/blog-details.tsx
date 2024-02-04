import { useNavigate, useParams } from '@solidjs/router';
import {
  batch,
  createEffect,
  createResource,
  createSignal,
  ErrorBoundary,
  For,
  Show,
  Suspense
} from 'solid-js';
import { createStore, produce } from 'solid-js/store';

import {
  addCommentAction,
  deleteBlogAction,
  deleteCommentAction,
  editCommentAction,
  fetchBlogByIdAction,
  fetchCommentAction,
  QueryWIthTargetInput
} from '@/apis';
import {
  CommentContainer,
  CommentForm,
  LoadingSpinner,
  OptionButton
} from '@/components';
import { useToastCtx } from '@/context';
import { Comment, ResponseErr } from '@/models';
import { NotFound } from '@/pages';
import { TagSidebar } from '@/parts';
import { formatTime } from '@/utils';

export const BlogDetails = () => {
  const { dispatch } = useToastCtx();
  const navigate = useNavigate();
  const blogId = useParams()['id'] as string;
  const [blog] = createResource(blogId, fetchBlogByIdAction);
  const [queryValue, setQueryValue] = createSignal<QueryWIthTargetInput>({
    targetId: blogId,
    offset: 0,
    limit: 2
  });
  const [commentResource] = createResource(queryValue, fetchCommentAction, {
    initialValue: []
  });
  const [comments, setComments] = createStore<Comment[]>([]);
  const addedCmts: Comment[] = [];

  createEffect(() => {
    if (commentResource().length > 0) {
      setComments(
        produce(oldComments =>
          oldComments.push(
            ...commentResource().filter(
              c => addedCmts.length === 0 || !addedCmts.some(d => d.id === c.id)
            )
          )
        )
      );
    }
  });

  const onAddCmtHandler = (content: string) => {
    addCommentAction({
      content,
      targetId: blogId,
      targetType: 'Blog'
    })
      .then(newCmt =>
        batch(() => {
          setComments(produce(c => c.unshift(newCmt)));
          addedCmts.push(newCmt);
        })
      )
      .catch((error: ResponseErr) =>
        dispatch.showToast({ msg: error.msg, type: 'Err' })
      );
  };

  const onLoadMoreCmtHandler = () => {
    setQueryValue(oldValue => ({
      ...oldValue,
      offset: (oldValue.offset as number) + 2
    }));
  };

  const onDeleteBlogHandler = () => {
    deleteBlogAction(blog()?.id as string)
      .then(() => {
        navigate(`/blogs`, { replace: true });
        return dispatch.showToast({ msg: 'Blog deleted', type: 'Ok' });
      })
      .catch((error: ResponseErr) => {
        dispatch.showToast({ msg: error.msg, type: 'Err' });
      });
  };

  const onEditCmtHandler = (commentId: string, content: string) =>
    editCommentAction(commentId, {
      content,
      targetId: blogId,
      targetType: 'Blog'
    })
      .then(comment => setComments(c => c.id === comment.id, comment))
      .catch((error: ResponseErr) =>
        dispatch.showToast({ msg: error.msg, type: 'Err' })
      ) as unknown;

  const onDeleteCmtHandler = (commentId: string, index: number) =>
    deleteCommentAction(commentId)
      .then(() => setComments(produce(comments => comments.splice(index, 1))))
      .catch((error: ResponseErr) =>
        dispatch.showToast({ msg: error.msg, type: 'Err' })
      ) as unknown;

  return (
    <Suspense
      fallback={
        <div class="flex h-svh items-center justify-center">
          <LoadingSpinner />
        </div>
      }
    >
      <ErrorBoundary fallback={<NotFound />}>
        <div class="my-10">
          <div class="ml-20 mt-16">
            <div class="flex justify-between">
              <div class="mb-10 flex w-3/5 flex-col gap-7 rounded-lg border px-10 py-7">
                <div>
                  <div class="flex items-center justify-between">
                    <p class="text-3xl font-bold">{blog()?.title}</p>
                    <OptionButton
                      isOwner={true}
                      onDelete={onDeleteBlogHandler}
                      id={''}
                      index={() => -1}
                    />
                  </div>
                  <p class="text-base text-gray-400">
                    {formatTime(blog()?.createdAt as string)}
                  </p>
                </div>
                <p class="text-xl text-gray-600">{blog()?.description}</p>
                <p class="text-lg">{blog()?.content}</p>
              </div>
              <div class="mr-24 w-1/5">
                <TagSidebar tags={blog()?.tags as string[]} />
              </div>
            </div>
            <div class="flex w-3/5 flex-col gap-5">
              <For each={comments}>
                {(comment, i) => (
                  <CommentContainer
                    comment={comment}
                    index={i}
                    onDelete={onDeleteCmtHandler}
                    onEdit={onEditCmtHandler}
                  />
                )}
              </For>
              <Show when={commentResource().length == 2}>
                <p
                  onClick={onLoadMoreCmtHandler}
                  class="-my-1 cursor-pointer text-gray-400 hover:text-gray-600"
                >
                  Load more...
                </p>
              </Show>
              <div class="mt-5">
                <CommentForm onSubmitHandler={onAddCmtHandler}>
                  New Comment
                </CommentForm>
              </div>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    </Suspense>
  );
};
