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

import {
  addPostAction,
  deletePostAction,
  editPostAction,
  filterPostsAction
} from '@/apis';
import { PAGINATION } from '@/constant';
import { PostDetails, RespErr } from '@/models';

import { useToastCtx } from './toast';

type Ctx = {
  posts: PostDetails[];
  dispatch: {
    add: (content: string) => void;
    del: (postId: string) => void;
    edit: (postId: string, content: string) => void;
  };
  utils: {
    handleScroll: () => void;
    loading: () => boolean;
  };
};

const ctx = createContext<Ctx>();
export const PostsProvider = (props: ParentProps) => {
  const { showToast } = useToastCtx();
  const [query, setQuery] = createSignal({ offset: 0 });
  const [resource] = createResource(query, filterPostsAction, {
    initialValue: []
  });
  const [posts, setPosts] = createStore<PostDetails[]>([]);
  const [reachedBottom, setReachedBottom] = createSignal(false);

  createEffect(() => {
    if (resource().length > 0) {
      batch(() => {
        setPosts(produce(posts => posts.push(...resource())));
        setReachedBottom(false);
      });
    }
  });

  const add = (content: string) => {
    addPostAction({ content })
      .then(() =>
        batch(() => {
          setPosts([]);
          setQuery(p => ({ ...p, offset: 0 }));
          showToast({ msg: 'Post Added', type: 'ok' });
        })
      )
      .catch((error: RespErr) => showToast({ msg: error.msg, type: 'err' }));
  };

  const del = (postId: string) => {
    deletePostAction(postId)
      .then(() =>
        batch(() => {
          setPosts([]);
          setQuery(p => ({ ...p, offset: 0 }));
          showToast({ msg: 'Post Deleted', type: 'ok' });
        })
      )
      .catch((error: RespErr) => showToast({ msg: error.msg, type: 'err' }));
  };

  const edit = (postId: string, content: string) => {
    editPostAction(postId, { content })
      .then(post =>
        batch(() => {
          setPosts(p => p.id === post.id, post);
          showToast({ msg: 'Post Updated', type: 'ok' });
        })
      )
      .catch((error: RespErr) => showToast({ msg: error.msg, type: 'err' }));
  };

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
    if (scrollPercentage > 90 && !reachedBottom()) {
      batch(() => {
        setQuery(p => ({ ...p, offset: p.offset + PAGINATION }));
        setReachedBottom(true);
      });
    }
  };

  const loading = () => posts.length === 0 && resource.loading;

  const state: Ctx = {
    posts,
    dispatch: {
      add,
      edit,
      del
    },
    utils: {
      handleScroll,
      loading
    }
  };

  return <ctx.Provider value={state}>{props.children}</ctx.Provider>;
};

export const usePostsCtx = () => useContext(ctx) as Ctx;
