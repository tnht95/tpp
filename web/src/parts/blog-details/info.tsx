import {
  batch,
  createEffect,
  createResource,
  createSignal,
  For,
  Show
} from 'solid-js';
import { createStore, produce } from 'solid-js/store';

import {
  addCommentAction,
  deleteCommentAction,
  editCommentAction,
  fetchCommentAction,
  QueryWIthTargetInput
} from '@/apis';
import {
  BlogForm,
  CommentContainer,
  CommentForm,
  Markdown,
  OptionButton
} from '@/components';
import { useBlogDetailsCtx, useToastCtx } from '@/context';
import { CommentDetails, RespErr } from '@/models';
import { TagSidebar } from '@/parts';
import { authenticationStore } from '@/store';
import { formatTime } from '@/utils';

export const BlogInfo = () => {
  const {
    utils: { isAdmin }
  } = authenticationStore;
  const { showToast } = useToastCtx();
  const {
    blog,
    dispatch: { edit, del },
    utils: { blogId },
    modal: { hide, show, initRef }
  } = useBlogDetailsCtx();

  const [queryValue, setQueryValue] = createSignal<QueryWIthTargetInput>({
    targetId: blogId,
    offset: 0,
    limit: 5
  });
  const [commentResource] = createResource(queryValue, fetchCommentAction, {
    initialValue: []
  });
  const [comments, setComments] = createStore<CommentDetails[]>([]);
  const addedCmts: CommentDetails[] = [];

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
          showToast({ msg: 'Comment Added', type: 'Ok' });
          addedCmts.push(newCmt);
        })
      )
      .catch((error: RespErr) => showToast({ msg: error.msg, type: 'Err' }));
  };

  const onLoadMoreCmtHandler = () => {
    setQueryValue(oldValue => ({
      ...oldValue,
      offset: (oldValue.offset as number) + 5
    }));
  };

  const onEditCmtHandler = (commentId: string, content: string) =>
    editCommentAction(commentId, {
      content,
      targetId: blogId,
      targetType: 'Blog'
    })
      .then(comment => {
        setComments(c => c.id === comment.id, comment);
        return showToast({ msg: 'Comment Updated', type: 'Ok' });
      })
      .catch((error: RespErr) =>
        showToast({ msg: error.msg, type: 'Err' })
      ) as unknown;

  const resetCmts = () =>
    batch(() => {
      addedCmts.length = 0;
      setComments([]);
      setQueryValue({
        targetId: blogId,
        offset: 0,
        limit: 5
      });
      showToast({ msg: 'Comment Deleted', type: 'Ok' });
    });

  const onDeleteCmtHandler = (commentId: string) =>
    deleteCommentAction(commentId)
      .then(resetCmts)
      .catch((error: RespErr) =>
        showToast({ msg: error.msg, type: 'Err' })
      ) as unknown;

  return (
    <div class="my-10">
      <div class="ml-20 mt-16">
        <div class="flex justify-between">
          <div class="mb-10 flex w-3/5 flex-col gap-7 rounded-lg border px-10 py-7">
            <div>
              <div class="flex items-center justify-between">
                <p class="text-3xl font-bold">{blog()?.title}</p>
                <OptionButton
                  isOwner={isAdmin()}
                  onDelete={del}
                  id={''}
                  onEdit={show}
                />
                <BlogForm
                  modalRef={initRef}
                  onCloseHandler={hide}
                  onSubmitHandler={edit}
                  blog={blog()}
                />
              </div>
              <p class="text-base text-gray-400">
                {formatTime(blog()?.createdAt as string)}
              </p>
            </div>
            <p class="text-xl text-gray-600">{blog()?.description}</p>
            <Markdown content={blog()?.content as string} />
          </div>
          <div class="mr-36 w-1/5">
            <TagSidebar tags={blog()?.tags as string[]} />
          </div>
        </div>
        <div class="flex w-3/5 flex-col gap-5">
          <For each={comments}>
            {comment => (
              <CommentContainer
                comment={comment}
                onDelete={onDeleteCmtHandler}
                onEdit={onEditCmtHandler}
              />
            )}
          </For>
          <Show when={commentResource().length == 5}>
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
  );
};
