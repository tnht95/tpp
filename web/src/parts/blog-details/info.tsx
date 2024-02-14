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
    <div class="my-10">
      <div class="ml-20 mt-16">
        <div class="flex justify-between">
          <div class="mb-10 flex w-3/5 flex-col gap-7 rounded-lg border px-10 py-7">
            <div>
              <div class="flex items-center justify-between">
                <p class="text-3xl font-bold">{blog()?.title}</p>
                <OptionButton
                  isOwner={isAdmin()}
                  onDeleteConfirm={del}
                  id={''}
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
          <CommentsProvider targetId={blogId} targetType="blog">
            <CommentContainer />
          </CommentsProvider>
        </div>
      </div>
    </div>
  );
};
