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
  addCommentAction,
  deleteCommentAction,
  editCommentAction,
  fetchCommentAction,
  QueryWIthTargetInput
} from '@/apis';
import { LoadingSpinner } from '@/components';
import { PAGINATION } from '@/constant';
import { CommentDetails, RespErr } from '@/models';
import { ModalUtil, useModal } from '@/utils';

import { useToastCtx } from './toast';

type Ctx = {
  comments: CommentDetails[];
  dispatch: {
    add: (content: string) => void;
    edit: (commentId: string, content: string) => void;
    del: (commentId: string) => void;
    fetchMore: () => void;
  };
  utils: {
    showMore: () => boolean;
  };
  modal: ModalUtil;
};

type Props = {
  targetId: string;
  targetType: 'Blog' | 'Post' | 'Discussion';
} & ParentProps;

const ctx = createContext<Ctx>();
export const CommentsProvider = (props: Props) => {
  const {
    dispatch: { showToast }
  } = useToastCtx();
  const modal = useModal();

  const [queryValue, setQueryValue] = createSignal<QueryWIthTargetInput>({
    targetId: props.targetId,
    offset: 0,
    limit: PAGINATION
  });

  const [resource] = createResource(queryValue, fetchCommentAction, {
    initialValue: []
  });
  const [comments, setComments] = createStore<CommentDetails[]>([]);
  const addedCmts: CommentDetails[] = [];

  createEffect(() => {
    if (resource().length > 0) {
      setComments(
        produce(cmts =>
          cmts.push(
            ...resource().filter(c => !addedCmts.some(d => d.id === c.id))
          )
        )
      );
    }
  });

  const add = (content: string) => {
    addCommentAction({
      content,
      targetId: props.targetId,
      targetType: props.targetType
    })
      .then(newCmt =>
        batch(() => {
          setComments(produce(c => c.unshift(newCmt)));
          showToast({ msg: 'Comment Added', type: 'Ok' });
          addedCmts.push(newCmt);
        })
      )
      .catch((error: RespErr) => showToast({ msg: error.msg, type: 'Err' }));
  };

  const edit = (commentId: string, content: string) => {
    editCommentAction(commentId, {
      content,
      targetId: props.targetId,
      targetType: props.targetType
    })
      .then(comment =>
        batch(() => {
          setComments(c => c.id === comment.id, comment);
          showToast({ msg: 'Comment Updated', type: 'Ok' });
        })
      )
      .catch((error: RespErr) => showToast({ msg: error.msg, type: 'Err' }));
  };

  const del = (commentId: string) => {
    deleteCommentAction(commentId)
      .then(() =>
        batch(() => {
          setComments([]);
          setQueryValue(q => ({ ...q, offset: 0 }));
          showToast({ msg: 'Comment Deleted', type: 'Ok' });
          addedCmts.length = 0;
        })
      )
      .catch((error: RespErr) => showToast({ msg: error.msg, type: 'Err' }));
  };

  const fetchMore = () => {
    setQueryValue(q => ({ ...q, offset: (q.offset as number) + PAGINATION }));
  };

  const showMore = () => resource().length === PAGINATION;

  const state: Ctx = {
    comments,
    dispatch: {
      add,
      edit,
      del,
      fetchMore
    },
    utils: {
      showMore
    },
    modal
  };

  return (
    <ctx.Provider value={state}>
      <Show when={!resource.loading} fallback={<LoadingSpinner />}>
        {props.children}
      </Show>
    </ctx.Provider>
  );
};

export const useCommentsCtx = () => useContext(ctx) as Ctx;
