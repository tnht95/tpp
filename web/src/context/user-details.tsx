import { useParams } from '@solidjs/router';
import {
  createContext,
  createEffect,
  createResource,
  createSignal,
  ErrorBoundary,
  ParentProps,
  Show,
  useContext
} from 'solid-js';

import { fetchUserByIdAction } from '@/apis';
import { LoadingSpinner } from '@/components';
import { UserDetails } from '@/models';
import { NotFound } from '@/pages';

type Ctx = {
  user: () => UserDetails;
  utils: {
    userId: () => string;
  };
};

const ctx = createContext<Ctx>();
export const UserDetailsProvider = (props: ParentProps) => {
  const [userId, setUserId] = createSignal(useParams()['id'] as string);
  const [resource] = createResource(userId, fetchUserByIdAction);

  createEffect(() => {
    setUserId(useParams()['id'] as string);
  });

  const state: Ctx = {
    user: () => resource() as UserDetails,
    utils: {
      userId
    }
  };

  return (
    <ctx.Provider value={state}>
      <Show when={!resource.loading} fallback={<LoadingSpinner />}>
        <ErrorBoundary fallback={<NotFound />}>{props.children}</ErrorBoundary>
      </Show>
    </ctx.Provider>
  );
};

export const useUserDetailsCtx = () => useContext(ctx) as Ctx;
