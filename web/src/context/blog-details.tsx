import { useNavigate, useParams } from '@solidjs/router';
import {
  batch,
  createContext,
  createResource,
  ErrorBoundary,
  ParentProps,
  Resource,
  Show,
  useContext
} from 'solid-js';

import { deleteBlogAction, editBlogAction, fetchBlogByIdAction } from '@/apis';
import { LoadingSpinner } from '@/components';
import { Blog, BlogRequest, RespErr } from '@/models';
import { NotFound } from '@/pages';
import { ModalUtil, useModal } from '@/utils';

import { useToastCtx } from './toast';

type Ctx = {
  blog: Resource<Blog | undefined>;
  dispatch: {
    edit: (blog: BlogRequest) => void;
    del: () => void;
  };
  utils: {
    blogId: string;
  };
  modal: ModalUtil;
};

const ctx = createContext<Ctx>();
export const BlogDetailsProvider = (props: ParentProps) => {
  const { showToast } = useToastCtx();
  const navigate = useNavigate();
  const modal = useModal();
  const blogId = useParams()['id'] as string;
  const [blog, { mutate }] = createResource(blogId, fetchBlogByIdAction);

  const edit = (blog: BlogRequest) => {
    editBlogAction(blogId, blog)
      .then(blog =>
        batch(() => {
          mutate(blog);
          modal.hide();
          showToast({ msg: 'Blog Updated', type: 'Ok' });
        })
      )
      .catch((error: RespErr) => showToast({ msg: error.msg, type: 'Err' }));
  };

  const del = () => {
    deleteBlogAction(blogId)
      .then(() =>
        batch(() => {
          navigate(`/blogs`);
          showToast({ msg: 'Blog Deleted', type: 'Ok' });
        })
      )
      .catch((error: RespErr) => showToast({ msg: error.msg, type: 'Err' }));
  };

  const state: Ctx = {
    blog,
    dispatch: { edit, del },
    utils: { blogId },
    modal
  };

  return (
    <ctx.Provider value={state}>
      <Show when={!blog.loading} fallback={<LoadingSpinner />}>
        <ErrorBoundary fallback={<NotFound />}>{props.children}</ErrorBoundary>
      </Show>
    </ctx.Provider>
  );
};

export const useBlogDetailsCtx = () => useContext(ctx) as Ctx;
