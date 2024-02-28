import { useNavigate, useParams } from '@solidjs/router';
import {
  batch,
  createContext,
  createEffect,
  createResource,
  createSignal,
  ErrorBoundary,
  ParentProps,
  Show,
  useContext
} from 'solid-js';

import { deleteBlogAction, editBlogAction, fetchBlogByIdAction } from '@/apis';
import { LoadingSpinner } from '@/components';
import { Blog, BlogRequest, RespErr } from '@/models';
import { NotFound } from '@/pages';
import { ModalUtil, useModalUtils } from '@/utils';

import { useToastCtx } from './toast';

type Ctx = {
  blog: () => Blog;
  dispatch: {
    edit: (blog: BlogRequest) => void;
    del: () => void;
  };
  utils: {
    blogId: () => string;
  };
  modal: ModalUtil;
};

const ctx = createContext<Ctx>();
export const BlogDetailsProvider = (props: ParentProps) => {
  const { showToast } = useToastCtx();
  const navigate = useNavigate();
  const modal = useModalUtils();
  const [blogId, setBlogId] = createSignal<string>(useParams()['id'] as string);
  const [resouce, { mutate }] = createResource(blogId, fetchBlogByIdAction);

  createEffect(() => {
    setBlogId(useParams()['id'] as string);
  });

  const edit = (blog: BlogRequest) => {
    editBlogAction(blogId(), blog)
      .then(blog =>
        batch(() => {
          mutate(blog);
          modal.hide();
          showToast({ msg: 'Blog Updated', type: 'ok' });
        })
      )
      .catch((error: RespErr) => showToast({ msg: error.msg, type: 'err' }));
  };

  const del = () => {
    deleteBlogAction(blogId())
      .then(() =>
        batch(() => {
          navigate(`/blogs`);
          showToast({ msg: 'Blog Deleted', type: 'ok' });
        })
      )
      .catch((error: RespErr) => showToast({ msg: error.msg, type: 'err' }));
  };

  const state: Ctx = {
    blog: () => resouce() as Blog,
    dispatch: { edit, del },
    utils: { blogId },
    modal
  };

  return (
    <ctx.Provider value={state}>
      <Show when={!resouce.loading} fallback={<LoadingSpinner />}>
        <ErrorBoundary fallback={<NotFound />}>{props.children}</ErrorBoundary>
      </Show>
    </ctx.Provider>
  );
};

export const useBlogDetailsCtx = () => useContext(ctx) as Ctx;
