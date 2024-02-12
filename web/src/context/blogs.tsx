import {
  batch,
  createContext,
  createEffect,
  createResource,
  createSignal,
  ParentProps,
  Show,
  useContext
} from 'solid-js';
import { createStore, produce } from 'solid-js/store';

import { addBlogAction, filterBlogAction } from '@/apis';
import { LoadingSpinner } from '@/components';
import { PAGINATION } from '@/constant';
import { BlogRequest, BlogSummary, RespErr } from '@/models';
import { ModalUtil, useModal } from '@/utils';

import { useToastCtx } from './toast';

type Ctx = {
  blogs: BlogSummary[];
  dispatch: {
    add: (discussion: BlogRequest) => void;
    fetchMore: () => void;
  };
  utils: {
    showMore: () => boolean;
  };
  modal: ModalUtil;
};

const ctx = createContext<Ctx>();
export const BlogsProvider = (props: ParentProps) => {
  const { showToast } = useToastCtx();
  const modal = useModal();
  const [query, setQuery] = createSignal({ offset: 0 });
  const [resource] = createResource(query, filterBlogAction, {
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
          showToast({ msg: 'Blog Added', type: 'Ok' });
        })
      )
      .catch((error: RespErr) => showToast({ msg: error.msg, type: 'Err' }));
  };

  const fetchMore = () => {
    setQuery(q => ({ ...q, offset: q.offset + PAGINATION }));
  };

  const showMore = () => resource().length === PAGINATION;

  const state: Ctx = {
    blogs,
    dispatch: {
      add,
      fetchMore
    },
    utils: {
      showMore
    },
    modal
  };

  return (
    <ctx.Provider value={state}>
      <Show
        when={blogs.length > 0 || !resource.loading}
        fallback={<LoadingSpinner />}
      >
        {props.children}
      </Show>
    </ctx.Provider>
  );
};

export const useBlogsCtx = () => useContext(ctx) as Ctx;
