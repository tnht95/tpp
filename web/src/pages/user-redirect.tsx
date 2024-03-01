import { Navigate, useParams } from '@solidjs/router';
import { createEffect, createResource, createSignal, Show } from 'solid-js';

import { fetchUserIdByNameAction } from '@/apis';

export const UserRedirect = () => {
  const [name, setName] = createSignal(useParams()['name'] as string);
  const [resource] = createResource(name, fetchUserIdByNameAction);

  createEffect(() => {
    setName(useParams()['name'] as string);
  });

  return (
    <Show when={resource()}>
      <Navigate href={`/users/${resource()}`} />
    </Show>
  );
};
