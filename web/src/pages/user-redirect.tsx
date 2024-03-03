import { Navigate, useParams } from '@solidjs/router';
import {
  createEffect,
  createResource,
  createSignal,
  ErrorBoundary,
  Show
} from 'solid-js';

import { fetchUserIdByNameAction } from '@/apis';
import { NotFound } from '@/pages';

export const UserRedirect = () => {
  const [name, setName] = createSignal(useParams()['name'] as string);
  const [resource] = createResource(name, fetchUserIdByNameAction);

  createEffect(() => {
    setName(useParams()['name'] as string);
  });

  return (
    <ErrorBoundary fallback={<NotFound />}>
      <Show when={resource()}>
        <Navigate href={`/users/${resource()}`} />
      </Show>
    </ErrorBoundary>
  );
};
