import { BlogForm, Markdown, OptionButton } from '@/components';
import { CommentsProvider, useBlogDetailsCtx } from '@/context';
import { CommentContainer, TagSidebar } from '@/parts';
import { authenticationStore } from '@/store';
import { formatTime } from '@/utils';

export const BlogInfo = () => {
  const {
    utils: { isAdmin }
  } = authenticationStore;
  const {
    blog,
    dispatch: { edit, del },
    utils: { blogId },
    modal: { hide, show, initRef }
  } = useBlogDetailsCtx();
  return (
    <div class="flex justify-between p-10">
      <div class="w-4/6">
        <div class="flex flex-col">
          <div class="flex flex-col gap-7 rounded-lg border px-10 py-7">
            <div class="flex flex-col">
              <div class="flex items-center justify-between">
                <p class="text-3xl font-bold">{blog().title}</p>
                <OptionButton
                  isOwner={isAdmin()}
                  onDeleteConfirm={del}
                  id={blogId}
                  onEditBtnClick={show}
                />
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
          <CommentsProvider targetId={blogId} targetType="blog">
            <CommentContainer />
          </CommentsProvider>
        </div>
      </div>
      <div class="w-1/6">
        <TagSidebar tags={blog().tags} loading={() => false} />
      </div>
    </div>
  );
};
