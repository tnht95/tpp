import { createEffect, createSignal, Show } from 'solid-js';

import { BlogForm, Markdown, OptionButton } from '@/components';
import { CommentsProvider, useBlogDetailsCtx } from '@/context';
import { CommentContainer, TagSidebar } from '@/parts';
import { authenticationStore } from '@/store';
import { formatTime } from '@/utils';

export const BlogDetailsInfo = () => {
  const {
    utils: { isAdmin }
  } = authenticationStore;
  const {
    blog,
    dispatch: { edit, del },
    utils: { blogId },
    modal: { hide, show, initRef }
  } = useBlogDetailsCtx();
  const [commentNumber, setCommentNumber] = createSignal(0);

  createEffect(() => {
    setCommentNumber(blog().comments);
  });

  return (
    <div class="flex justify-between p-10">
      <div class="w-4/6">
        <div class="flex flex-col">
          <div class="mb-6 flex flex-col gap-7 rounded-lg border px-10 py-7">
            <div class="flex flex-col">
              <div class="flex items-center justify-between">
                <p class="text-3xl font-bold">{blog().title}</p>
                <Show when={isAdmin()}>
                  <OptionButton
                    onDeleteConfirm={del}
                    id={blogId}
                    onEditBtnClick={show}
                  />
                </Show>
                <BlogForm
                  modalRef={initRef}
                  onCloseHandler={hide}
                  onSubmitHandler={edit}
                  blog={blog()}
                />
              </div>
              <p class="text-base text-gray-400">
                {formatTime(blog().createdAt)}
              </p>
            </div>
            <p class="text-xl text-gray-600">{blog().description}</p>
            <Markdown content={blog().content} />
          </div>
          <Show when={commentNumber() > 0}>
            <div class="mb-6 text-lg font-semibold">
              <i class="fa-regular fa-comment-dots mr-1.5" />
              <span>{commentNumber()} comment(s)</span>
            </div>
          </Show>
          <CommentsProvider
            targetId={blogId}
            targetType="blogs"
            onAddNewCmt={() => setCommentNumber(c => c + 1)}
            onDeleteCmt={() => setCommentNumber(c => c - 1)}
          >
            <CommentContainer />
          </CommentsProvider>
        </div>
      </div>
      <div class="w-1/4">
        <TagSidebar tags={blog().tags} loading={() => false} />
      </div>
    </div>
  );
};
