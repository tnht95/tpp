import { useParams } from '@solidjs/router';
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
  Avatar,
  CommentContainer,
  CommentForm,
  DiscussionForm,
  Markdown,
  OptionButton
} from '@/components';
import { useAuthCtx, useDiscussionDetailsCtx, useToastCtx } from '@/context';
import { CommentDetails, RespErr } from '@/models';
import { formatTime } from '@/utils';

export const DiscussionDetails = () => {
  const {
    utils: { isSameUser }
  } = useAuthCtx();
  const { dispatch } = useToastCtx();
  const {
    discussion,
    dispatch: { edit, del },
    modal: { initRef, show, hide }
  } = useDiscussionDetailsCtx();
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

  return (
    <>
      <DiscussionForm
        ref={initRef}
        onCloseHandler={hide}
        onSubmitHandler={edit}
        discussion={discussion()}
      />
      <div class="flex flex-col gap-9 px-5">
        <div class="border-b pb-5">
          <div class="flex items-center">
            <p class="mr-3 text-3xl font-semibold">{discussion()?.title}</p>
            <OptionButton
              isOwner={isSameUser(discussion()?.userId as number)}
              onDelete={del}
              id={''}
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
        <div class="flex gap-5 border-b pb-9">
          <Avatar
            img={discussion()?.userAvatar as string}
            userId={discussion()?.userId as number}
          />
          <div class="w-full rounded-lg border-2 border-dashed p-5">
            <Markdown content={discussion()?.content as string} />
          </div>
        </div>
        <div class="flex flex-col">
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
    </>
  );
};
