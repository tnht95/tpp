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

import {
  addPostAction,
  deletePostAction,
  editPostAction,
  fetchPostAction
} from '@/apis';
import { LoadingSpinner } from '@/components';
import { PAGINATION } from '@/constant';
import { PostDetails, RespErr } from '@/models';
import { ModalUtil, useModal } from '@/utils';

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
    showMore: () => boolean;
  };
  modal: ModalUtil;
};

const ctx = createContext<Ctx>();
export const PostsProvider = (props: ParentProps) => {
  const { showToast } = useToastCtx();
  const modal = useModal();
  const [params, setParams] = createSignal({ offset: 0 });
  const [resource] = createResource(params, fetchPostAction, {
    initialValue: []
  });
  const [posts, setPosts] = createStore<PostDetails[]>([]);
  const [hasReachedBottom, setHasReachedBottom] = createSignal(false);

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
    if (scrollPercentage > 90 && !hasReachedBottom()) {
      batch(() => {
        setParams(p => ({ ...p, offset: p.offset + PAGINATION }));
        setHasReachedBottom(true);
      });
    }
  };

  createEffect(() => {
    if (resource().length > 0) {
      batch(() => {
        setPosts(produce(posts => posts.push(...resource())));
        setHasReachedBottom(false);
      });
    }
  });

  const add = (content: string) => {
    addPostAction({ content })
      .then(() =>
        batch(() => {
          setPosts([]);
          setParams(p => ({ ...p, offset: 0 }));
          showToast({ msg: 'Post Added', type: 'Ok' });
        })
      )
      .catch((error: RespErr) => showToast({ msg: error.msg, type: 'Err' }));
  };

  const del = (postId: string) => {
    deletePostAction(postId)
      .then(() =>
        batch(() => {
          setPosts([]);
          setParams(p => ({ ...p, offset: 0 }));
          showToast({ msg: 'Post Deleted', type: 'Ok' });
        })
      )
      .catch((error: RespErr) => showToast({ msg: error.msg, type: 'Err' }));
  };

  const edit = (postId: string, content: string) => {
    editPostAction(postId, { content })
      .then(post =>
        batch(() => {
          setPosts(p => p.id === post.id, post);
          showToast({ msg: 'Post Updated', type: 'Ok' });
        })
      )
      .catch((error: RespErr) => showToast({ msg: error.msg, type: 'Err' }));
  };

  const showMore = () => resource().length === PAGINATION;

  const state: Ctx = {
    posts,
    dispatch: {
      add,
      edit,
      del
    },
    utils: {
      handleScroll,
      showMore
    },
    modal
  };

  return (
    <ctx.Provider value={state}>
      <Show
        when={posts.length > 0 || !resource.loading}
        fallback={<LoadingSpinner />}
      >
        {props.children}
      </Show>
    </ctx.Provider>
  );
};

export const usePostsCtx = () => useContext(ctx) as Ctx;
