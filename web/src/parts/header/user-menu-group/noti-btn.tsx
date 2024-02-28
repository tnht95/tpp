import {
  createEffect,
  createResource,
  createSignal,
  For,
  onCleanup,
  onMount
} from 'solid-js';
import { createStore, produce } from 'solid-js/store';

import { filterNotificationssAction } from '@/apis';
import { NotificationCard } from '@/components';
import { Notification } from '@/models';
import { authenticationStore } from '@/store';
import { connect, disconnect, useDropdownUtils } from '@/utils';

export const UserMenuGroupNotiBtn = () => {
  const dropdown = useDropdownUtils();
  const {
    utils: { getWsTicket }
  } = authenticationStore;
  const [query] = createSignal({ offset: 0 });
  const [resource] = createResource(query, filterNotificationssAction, {
    initialValue: []
  });
  const [notifications, setNotifications] = createStore<Notification[]>([]);

  createEffect(() => {
    if (resource().length > 0) {
      setNotifications(produce(notis => notis.push(...resource())));
    }
  });

  onMount(() => {
    connect(getWsTicket() as string, noti => {
      setNotifications(produce(notis => notis.unshift(noti)));
    });
  });

  onCleanup(() => {
    disconnect();
  });

  return (
    <>
      <button
        class="relative py-1.5 text-sm font-medium text-black hover:text-gray-500 focus:outline-none"
        ref={dropdown.initBtnRef}
        disabled={notifications.length === 0}
        classList={{ 'cursor-not-allowed': notifications.length === 0 }}
      >
        <i class="fa-solid fa-earth-americas text-2xl" />
        <div class="absolute left-4 start-4 top-1.5 block size-3 rounded-full border-2 border-white bg-red-500" />
      </button>
      <div
        class="z-10 hidden w-80 divide-y divide-gray-100 rounded-lg bg-white shadow"
        ref={dropdown.initRef}
      >
        <For each={notifications}>
          {notification => (
            <NotificationCard
              notification={notification}
              onClick={dropdown.hide}
            />
          )}
        </For>
      </div>
    </>
  );
};
