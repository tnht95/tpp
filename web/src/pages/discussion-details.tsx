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
  deleteCommentAction,
  deleteDiscussionAction,
  editCommentAction,
  fetchCommentAction,
  QueryWIthTargetInput
} from '@/apis';
import {
  Avatar,
  CommentContainer,
  CommentForm,
  DiscussionForm,
  LoadingSpinner,
  Markdown,
  OptionButton
} from '@/components';
import { useAuthCtx, useDiscussionDetailsCtx, useToastCtx } from '@/context';
import { CommentDetails, RespErr } from '@/models';
import { NotFound } from '@/pages';
import { formatTime } from '@/utils';

export const DiscussionDetails = () => {
  const {
    utils: { isSameUser }
  } = useAuthCtx();
  const { dispatch } = useToastCtx();
  const {
    discussion,
    dispatch: { edit },
    utils: { gameId, isEditMode },
    modal: { initRef, show, hide }
  } = useDiscussionDetailsCtx();
  const navigate = useNavigate();
  const discussionId = useParams()['discussionId'] as string;
  const [queryValue, setQueryValue] = createSignal<QueryWIthTargetInput>({
    targetId: discussionId,
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
      targetId: discussionId,
      targetType: 'Discussion'
    })
      .then(newCmt =>
        batch(() => {
          setComments(produce(c => c.unshift(newCmt)));
          addedCmts.push(newCmt);
          dispatch.showToast({ msg: 'Comment Added', type: 'Ok' });
        })
      )
      .catch((error: RespErr) =>
        dispatch.showToast({ msg: error.msg, type: 'Err' })
      );
  };

  const onEditCmtHandler = (commentId: string, content: string) =>
    editCommentAction(commentId, {
      content,
      targetId: discussionId,
      targetType: 'Discussion'
    })
      .then(comment => {
        setComments(c => c.id === comment.id, comment);
        return dispatch.showToast({ msg: 'Comment Updated', type: 'Ok' });
      })
      .catch((error: RespErr) =>
        dispatch.showToast({ msg: error.msg, type: 'Err' })
      ) as unknown;

  const resetCmts = () =>
    batch(() => {
      addedCmts.length = 0;
      setComments([]);
      setQueryValue({
        targetId: discussionId,
        offset: 0,
        limit: 5
      });
      dispatch.showToast({ msg: 'Comment Deleted', type: 'Ok' });
    });

  const onDeleteCmtHandler = (commentId: string) =>
    deleteCommentAction(commentId)
      .then(resetCmts)
      .catch((error: RespErr) =>
        dispatch.showToast({ msg: error.msg, type: 'Err' })
      ) as unknown;

  const onLoadMoreCmtHandler = () => {
    setQueryValue(oldValue => ({
      ...oldValue,
      offset: (oldValue.offset as number) + 5
    }));
  };

  const onDeleteDiscussionHandler = () => {
    deleteDiscussionAction(discussionId)
      .then(() => {
        // rf();
        navigate(`/games/${gameId}/discussion`);
        return dispatch.showToast({ msg: 'Discussion Deleted', type: 'Ok' });
      })
      .catch((error: RespErr) => {
        dispatch.showToast({ msg: error.msg, type: 'Err' });
      });
  };

  return (
    <Suspense
      fallback={
        <div class="flex h-svh items-center justify-center">
          <LoadingSpinner />
        </div>
      }
    >
      <ErrorBoundary fallback={<NotFound />}>
        <DiscussionForm
          ref={initRef}
          onCloseHandler={hide}
          onSubmitHandler={edit}
          discussion={discussion()}
        />
        <div class="ml-5 flex flex-col">
          <div class="border-b pb-5">
            <div class="flex items-center">
              <p class="mr-3 text-3xl font-semibold">{discussion()?.title}</p>
              <OptionButton
                isOwner={isSameUser(discussion()?.userId as number)}
                onDelete={onDeleteDiscussionHandler}
                id={''}
                isEditMode={isEditMode}
                onEdit={show}
              />
            </div>
            <p class="mt-1 text-base text-gray-400">
              On {formatTime(discussion()?.createdAt as string)} by{' '}
              <a
                target="_blank"
                href={`/users/${discussion()?.userId}`}
                class="font-bold hover:text-gray-600 hover:underline"
              >
                {discussion()?.userName}
              </a>
            </p>
          </div>
          <div class="mt-9 flex justify-between border-b pb-9">
            <Avatar
              img={discussion()?.userAvatar as string}
              userId={discussion()?.userId as number}
            />
            <div class="ml-4 w-full rounded-lg border-2 border-dashed p-5">
              <Markdown content={discussion()?.content as string} />
            </div>
          </div>
          <div class="my-9 flex flex-col gap-7">
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
            <CommentForm onSubmitHandler={onAddCmtHandler}>
              New Comment
            </CommentForm>
          </div>
        </div>
      </ErrorBoundary>
    </Suspense>
  );
};
