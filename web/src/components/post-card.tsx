import {
  batch,
  createEffect,
  createResource,
  createSignal,
  Show
} from 'solid-js';
import { createStore, produce } from 'solid-js/store';

import { fetchCommentAction, QueryWIthTargetInput } from '@/apis';
import { Avatar, CommentForm, Markdown, OptionButton } from '@/components';
import { CommentsProvider } from '@/context';
import { CommentDetails, PostDetails } from '@/models';
import { CommentContainer } from '@/parts';
import { authenticationStore } from '@/store';
import { formatTime } from '@/utils';

type PostCardProps = {
  post: PostDetails;
  onDelete: (postId: string) => void;
  onEdit: (postId: string, content: string) => void;
};

export const PostCard = (props: PostCardProps) => {
  const { utils } = authenticationStore;
  const [isEditMode, setIsEditMode] = createSignal(false);
  const [isCommentHidden, setIsCommentHidden] = createSignal(true);
  const [queryValue, setQueryValue] = createSignal<QueryWIthTargetInput>();
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
        <CommentsProvider targetType="Post" targetId={props.post.id}>
          <CommentContainer />
        </CommentsProvider>
      </div>
    </div>
  );
};
