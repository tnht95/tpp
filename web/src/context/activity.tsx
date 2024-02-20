import {
  createContext,
  createEffect,
  createResource,
  createSignal,
  ParentProps,
  useContext
} from 'solid-js';
import { createStore, produce } from 'solid-js/store';

import { filterActivitiesAction, QueryWIthTargetInput } from '@/apis';
import { PAGINATION } from '@/constant';
import { Activity } from '@/models';

type Ctx = {
  activities: Activity[];
  dispatch: {
    fetchMore: () => void;
  };
  utils: {
    showMore: () => void;
    loading: () => boolean;
  };
};

type Props = {
  userId: number;
  targetId?: string | undefined;
} & ParentProps;

const ctx = createContext<Ctx>();
export const ActivitiesProvider = (props: Props) => {
  const [query, setQuery] = createSignal<[number, QueryWIthTargetInput]>([
    props.userId,
    {
      targetId: props.targetId,
      offset: 0,
      limit: PAGINATION
    }
  ]);
  const [resource] = createResource(query, filterActivitiesAction, {
    initialValue: []
  });
  const [activities, setActivities] = createStore<Activity[]>([]);

  createEffect(() => {
    if (resource().length > 0) {
      setActivities(produce(activities => activities.push(...resource())));
    }
  });

  const fetchMore = () => {
    setQuery(q => [
      q[0],
      {
        ...q[1],
        offset: (q[1].offset as number) + PAGINATION
      }
    ]);
  };

  const showMore = () => resource().length === PAGINATION;

  const loading = () => activities.length === 0 && resource.loading;

  const state: Ctx = {
    activities,
    dispatch: {
      fetchMore
    },
    utils: {
      showMore,
      loading
    }
  };

  return <ctx.Provider value={state}>{props.children}</ctx.Provider>;
};

export const useActivitiesCtx = () => useContext(ctx) as Ctx;
