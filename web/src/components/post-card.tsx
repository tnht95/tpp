import { createSignal, Show } from 'solid-js';

import {
  Avatar,
  Comment,
  CommentForm,
  Markdown,
  OptionButton
} from '@/components';
import { useAuthCtx } from '@/context';
import { Post } from '@/models';
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

  const toggleComment = () => {
    setIsCommentHidden(!isCommentHidden());
  };

  const onSubmitHandler = (content: string) => {
    setIsEditMode(false);
    props.onEdit(props.post.id, content);
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
        <Comment user="Ron" date="10 Feb 2022" likeNumber={11} liked={true} />
        <Comment user="Ron" date="10 Feb 2022" likeNumber={1} liked={false} />
        <p class="-mt-1 cursor-pointer text-gray-400 hover:text-gray-600">
          Load more...
        </p>
        <CommentForm />
      </div>
    </div>
  );
};
