import {
  batch,
  createEffect,
  createResource,
  createSignal,
  For,
  Show
} from 'solid-js';
import { createStore, produce } from 'solid-js/store';

import { CommentQueryInput, fetchCommentAction } from '@/apis';
import {
  Avatar,
  CommentContainer,
  CommentForm,
  Markdown,
  OptionButton
} from '@/components';
import { useAuthCtx } from '@/context';
import { Comment, Post } from '@/models';
import { formatTime } from '@/utils';

type PostCardProps = {
  post: Post;
  onDelete: (postId: string) => void;
  onEdit: (postId: string, content: string) => void;
};

export const PostCard = (props: PostCardProps) => {
  const { utils } = useAuthCtx();
  const [isEditMode, setIsEditMode] = createSignal(false);
  const [isCommentHidden, setIsCommentHidden] = createSignal(true);
  const [queryValue, setQueryValue] = createSignal<CommentQueryInput>();
  const [commentResource] = createResource(queryValue, fetchCommentAction, {
    initialValue: []
  });
  const [comments, setComments] = createStore<Comment[]>(commentResource());

  createEffect(() => {
    if (commentResource().length > 0) {
      setComments(
        produce(oldComments => oldComments.push(...commentResource()))
      );
    }
  });

  const toggleComment = () => {
    batch(() => {
      setIsCommentHidden(!isCommentHidden());
      !queryValue() &&
        setQueryValue({
          targetId: props.post.id,
          offset: 0,
          limit: 2
        });
    });
  };

  const onSubmitHandler = (content: string) => {
    setIsEditMode(false);
    props.onEdit(props.post.id, content);
  };

  const handleGetMore = () => {
    setQueryValue(oldValue => ({
      ...(oldValue as CommentQueryInput),
      offset: (oldValue?.offset as number) + 2
    }));
  };

  return (
    <div class="w-full rounded-xl border bg-white p-10 pb-2">
      <div class="flex justify-between">
        <div class="flex w-full items-center">
          <Avatar />
          <div class="ml-2 w-full leading-tight">
            <div class="flex items-center justify-between">
              <p class="text-base font-bold text-black">Visualize Value</p>
              <OptionButton
                isOwner={utils.isSameUser(props.post.authorId)}
                onDelete={props.onDelete}
                id={props.post.id}
                isEditMode={isEditMode}
                setIsEditMode={setIsEditMode}
              />
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
            onSubmitHandler={onSubmitHandler}
          />
        </Show>
      </p>
      <div class="mt-3 flex w-full text-gray-500">
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
        class="flex flex-col gap-5 py-5"
        classList={{ hidden: isCommentHidden() }}
      >
        <Show when={comments}>
          <For each={comments}>
            {comment => <CommentContainer comment={comment} />}
          </For>
        </Show>
        <Show when={commentResource().length == 2}>
          <p
            class="-mt-1 cursor-pointer text-gray-400 hover:text-gray-600"
            onClick={handleGetMore}
          >
            Load more...
          </p>
        </Show>

        <CommentForm />
      </div>
    </div>
  );
};
