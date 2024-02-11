import { useParams } from '@solidjs/router';
import {
  createContext,
  createResource,
  ErrorBoundary,
  ParentProps,
  Resource,
  Show,
  useContext
} from 'solid-js';

import { fetchUserByIdAction } from '@/apis';
import { LoadingSpinner } from '@/components';
import { User } from '@/models';
import { NotFound } from '@/pages';

type Ctx = {
  user: Resource<User | undefined>;
  utils: {
    userId: string;
  };
};

const ctx = createContext<Ctx>();
export const UserDetailsProvider = (props: ParentProps) => {
  const userId = useParams()['id'] as string;
  const [user] = createResource(userId, fetchUserByIdAction);

  const state: Ctx = {
    user,
    utils: {
      userId
    }
  };

  return (
    <ctx.Provider value={state}>
      <Show when={!user.loading} fallback={<LoadingSpinner />}>
        <ErrorBoundary fallback={<NotFound />}>{props.children}</ErrorBoundary>
      </Show>
    </ctx.Provider>
  );
};

export const useUserDetailsCtx = () => useContext(ctx) as Ctx;
