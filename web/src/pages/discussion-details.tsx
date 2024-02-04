import { useParams } from '@solidjs/router';
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
  fetchCommentAction,
  fetchDiscussionByIdAction,
  QueryWIthTargetInput
} from '@/apis';
import {
  Avatar,
  CommentContainer,
  CommentForm,
  LoadingSpinner,
  OptionButton
} from '@/components';
import { useToastCtx } from '@/context';
import { Comment, ResponseErr } from '@/models';
import { NotFound } from '@/pages';
import { formatTime } from '@/utils';

export const DiscussionDetails = () => {
  const discussionId = useParams()['discussionId'] as string;
  const { dispatch } = useToastCtx();

  const [discussion] = createResource(discussionId, fetchDiscussionByIdAction);
  const [queryValue, setQueryValue] = createSignal<QueryWIthTargetInput>({
    targetId: discussionId,
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
      targetId: discussionId,
      targetType: 'Discussion'
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

  return (
    <Suspense
      fallback={
        <div class="flex h-svh items-center justify-center">
          <LoadingSpinner />
        </div>
      }
    >
      <ErrorBoundary fallback={<NotFound />}>
        <div class="ml-10 flex flex-col">
          <div class="border-b pb-5">
            <div class="flex items-center">
              <p class="mr-3 text-3xl font-semibold">{discussion()?.title}</p>
              <OptionButton
                isOwner={true}
                onDelete={() => {}}
                id={''}
                index={() => -1}
                onEdit={() => {}}
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
              {discussion()?.content}
            </div>
          </div>
          <div class="my-9 flex flex-col gap-7">
            <For each={comments}>
              {(comment, i) => (
                <CommentContainer
                  comment={comment}
                  index={i}
                  onDelete={() => {}}
                  onEdit={() => {}}
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
            <CommentForm onSubmitHandler={onAddCmtHandler}>
              New Comment
            </CommentForm>
          </div>
        </div>
      </ErrorBoundary>
    </Suspense>
  );
};
