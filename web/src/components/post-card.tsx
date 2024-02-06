import {
  Accessor,
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
  Markdown,
  OptionButton
} from '@/components';
import { useAuthCtx, useToastCtx } from '@/context';
import { Comment, PostDetails, ResponseErr } from '@/models';
import { formatTime } from '@/utils';

type PostCardProps = {
  index: Accessor<number>;
  post: PostDetails;
  onDelete: (postId: string, index: number) => void;
  onEdit: (postId: string, content: string) => void;
};

export const PostCard = (props: PostCardProps) => {
  const { utils } = useAuthCtx();
  const { dispatch } = useToastCtx();

  const [isEditMode, setIsEditMode] = createSignal(false);
  const [isCommentHidden, setIsCommentHidden] = createSignal(true);
  const [queryValue, setQueryValue] = createSignal<QueryWIthTargetInput>();
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

  const toggleComment = () => {
    batch(() => {
      setIsCommentHidden(!isCommentHidden());
      // first time only
      !queryValue() &&
        setQueryValue({
          targetId: props.post.id,
          offset: 0,
          limit: 5
        });
    });
  };

  const onSubmitPostHandler = (content: string) => {
    setIsEditMode(false);
    props.onEdit(props.post.id, content);
  };

  const onAddCommentHandler = (content: string) => {
    addCommentAction({
      content,
      targetId: props.post.id,
      targetType: 'Post'
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

  const onLoadMoreHandler = () => {
    setQueryValue(oldValue => ({
      ...(oldValue as QueryWIthTargetInput),
      offset: (oldValue?.offset as number) + 5
    }));
  };

  const onEditCmtHandler = (commentId: string, content: string) =>
    editCommentAction(commentId, {
      content,
      targetId: props.post.id,
      targetType: 'Post'
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
    <div class="max-w-full break-all rounded-xl border bg-white p-10 pb-2">
      <div class="flex justify-between">
        <div class="flex w-full items-center">
          <Avatar img={props.post.authorAvatar} userId={props.post.authorId} />
          <div class="ml-2 w-full leading-tight">
            <div class="flex items-center justify-between">
              <p class="text-base font-bold text-black">
                {props.post.authorName}
              </p>
              {utils.isAuth() && (
                <OptionButton
                  index={props.index}
                  isOwner={utils.isSameUser(props.post.authorId)}
                  onDelete={props.onDelete}
                  id={props.post.id}
                  isEditMode={isEditMode}
                  onEdit={() => {
                    setIsEditMode(!isEditMode());
                  }}
                />
              )}
            </div>
            <span class="block text-sm font-normal text-gray-500 dark:text-gray-400">
              {formatTime(props.post.createdAt)}
            </span>
          </div>
        </div>
      </div>
      <p class="mt-3 block text-xl leading-snug text-black dark:text-white">
        <Show
          when={isEditMode()}
          fallback={<Markdown content={props.post.content} />}
        >
          <CommentForm
            content={props.post.content}
            onSubmitHandler={onSubmitPostHandler}
          />
        </Show>
      </p>
      <div class="mt-3 flex w-full select-none text-gray-500">
        <div class="flex w-full items-center gap-3 py-3">
          <div class="flex w-1/2 cursor-pointer items-center justify-center border-r-2 hover:font-bold hover:text-red-600">
            <i class="fa-regular fa-heart" />
            <span class="ml-2">{`Like (${props.post.likes})`}</span>
          </div>
          <div
            class="flex w-1/2 cursor-pointer items-center justify-center hover:font-bold hover:text-blue-700"
            onClick={toggleComment}
          >
            <i class="fa-regular fa-comment" />
            <span class="ml-2">{`Comment (${props.post.comments})`}</span>
          </div>
        </div>
      </div>
      <div
        class="flex flex-col gap-5"
        classList={{
          hidden: isCommentHidden(),
          'py-5': comments.length > 0 || utils.isAuth()
        }}
      >
        <Show when={comments}>
          <For each={comments}>
            {(comment, index) => (
              <CommentContainer
                comment={comment}
                index={index}
                onDelete={onDeleteCmtHandler}
                onEdit={onEditCmtHandler}
              />
            )}
          </For>
        </Show>
        <Show when={commentResource().length == 5}>
          <p
            class="-mt-1 cursor-pointer text-gray-400 hover:text-gray-600"
            onClick={onLoadMoreHandler}
          >
            Load more...
          </p>
        </Show>
        {utils.isAuth() && (
          <CommentForm onSubmitHandler={onAddCommentHandler} />
        )}
      </div>
    </div>
  );
};
