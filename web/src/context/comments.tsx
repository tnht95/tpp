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
  addCommentAction,
  deleteCommentAction,
  editCommentAction,
  filterCommentsAction,
  QueryWIthTargetInput
} from '@/apis';
import { PAGINATION } from '@/constant';
import { CommentDetails, CommentType } from '@/models';

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
    loading: () => boolean;
  };
};

type Props = {
  targetId: string;
  targetType: CommentType;
  onAddNewCmt?: () => void;
  onDeleteCmt?: () => void;
} & ParentProps;

const ctx = createContext<Ctx>();
export const CommentsProvider = (props: Props) => {
  const { showToast } = useToastCtx();
  const [query, setQuery] = createSignal<QueryWIthTargetInput>({
    targetId: props.targetId,
    offset: 0,
    limit: PAGINATION
  });
  const [resource] = createResource(query, filterCommentsAction, {
    initialValue: []
  });
  const [comments, setComments] = createStore<CommentDetails[]>([]);
  const newAddedCmts: CommentDetails[] = [];

  createEffect(() => {
    if (resource().length > 0) {
      setComments(
        produce(cmts =>
          cmts.push(
            ...resource().filter(c => !newAddedCmts.some(n => n.id === c.id))
          )
        )
      );
    }
  });

  const onAddCmtBatchHandler = (cmt: CommentDetails) =>
    batch(() => {
      setComments(produce(c => c.push(cmt)));
      showToast({ message: 'Comment Added', type: 'ok' });
      newAddedCmts.push(cmt);
      props.onAddNewCmt && props.onAddNewCmt();
    });

  const onDeleteCmtBatchHandler = () =>
    batch(() => {
      setComments([]);
      setQuery(q => ({ ...q, offset: 0 }));
      showToast({ message: 'Comment Deleted', type: 'ok' });
      newAddedCmts.length = 0;
      props.onDeleteCmt && props.onDeleteCmt();
    });

  const add = (content: string) => {
    addCommentAction({
      content,
      targetId: props.targetId,
      targetType: props.targetType
    })
      .then(onAddCmtBatchHandler)
      .catch(({ message }: Error) => showToast({ message, type: 'err' }));
  };

  const edit = (commentId: string, content: string) => {
    editCommentAction(commentId, {
      content,
      targetId: props.targetId,
      targetType: props.targetType
    })
      .then(cmt =>
        batch(() => {
          setComments(c => c.id === cmt.id, cmt);
          showToast({ message: 'Comment Updated', type: 'ok' });
        })
      )
      .catch(({ message }: Error) => showToast({ message, type: 'err' }));
  };

  const del = (commentId: string) => {
    deleteCommentAction(commentId, {
      targetId: props.targetId,
      targetType: props.targetType
    })
      .then(onDeleteCmtBatchHandler)
      .catch(({ message }: Error) => showToast({ message, type: 'err' }));
  };

  const fetchMore = () => {
    setQuery(q => ({ ...q, offset: (q.offset as number) + PAGINATION }));
  };

  const showMore = () => resource().length === PAGINATION;

  const loading = () => comments.length === 0 && resource.loading;

  const state: Ctx = {
    comments,
    dispatch: {
      add,
      edit,
      del,
      fetchMore
    },
    utils: {
      showMore,
      loading
    }
  };

  return <ctx.Provider value={state}>{props.children}</ctx.Provider>;
};

export const useCommentsCtx = () => useContext(ctx) as Ctx;
