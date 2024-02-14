import {
  batch,
  createContext,
  createEffect,
  createResource,
  createSignal,
  ParentProps,
  useContext
} from 'solid-js';
import { createStore, produce } from 'solid-js/store';

import { addBlogAction, filterBlogsAction } from '@/apis';
import { PAGINATION } from '@/constant';
import { BlogRequest, BlogSummary, RespErr } from '@/models';
import { ModalUtil, useModalUtils } from '@/utils';

import { useToastCtx } from './toast';

type Ctx = {
  blogs: BlogSummary[];
  dispatch: {
    add: (discussion: BlogRequest) => void;
    fetchMore: () => void;
  };
  utils: {
    showMore: () => boolean;
    loading: () => boolean;
  };
  modal: ModalUtil;
};

const ctx = createContext<Ctx>();
export const BlogsProvider = (props: ParentProps) => {
  const { showToast } = useToastCtx();
  const modal = useModalUtils();
  const [query, setQuery] = createSignal({ offset: 0 });
  const [resource] = createResource(query, filterBlogsAction, {
    initialValue: []
  });
  const [blogs, setBlogs] = createStore<BlogSummary[]>([]);

  createEffect(() => {
    if (resource().length > 0) {
      setBlogs(produce(blogs => blogs.push(...resource())));
    }
  });

  const add = (blog: BlogRequest) => {
    addBlogAction(blog)
      .then(() =>
        batch(() => {
          setBlogs([]);
          setQuery({ offset: 0 });
          modal.hide();
          showToast({ msg: 'Blog Added', type: 'ok' });
        })
      )
      .catch((error: RespErr) => showToast({ msg: error.msg, type: 'err' }));
  };

  const fetchMore = () => {
    setQuery(q => ({ ...q, offset: q.offset + PAGINATION }));
  };

  const showMore = () => resource().length === PAGINATION;

  const loading = () => blogs.length === 0 && resource.loading;

  const state: Ctx = {
    blogs,
    dispatch: {
      add,
      fetchMore
    },
    utils: {
      showMore,
      loading
    },
    modal
  };

  return <ctx.Provider value={state}>{props.children}</ctx.Provider>;
};

export const useBlogsCtx = () => useContext(ctx) as Ctx;
