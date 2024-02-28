import {
  batch,
  createEffect,
  createResource,
  createSignal,
  For,
  onCleanup,
  onMount,
  Show
} from 'solid-js';
import { createStore, produce } from 'solid-js/store';

import {
  checkNotificationAction,
  fetchNotificationCheckAction,
  filterNotificationsAction,
  readNotificationAction
} from '@/apis';
import { NotificationCard } from '@/components';
import { useToastCtx } from '@/context';
import { Notification, RespErr } from '@/models';
import { authenticationStore } from '@/store';
import { connect, disconnect, useDropdownUtils } from '@/utils';

export const UserMenuGroupNotiBtn = () => {
  const dropdown = useDropdownUtils();
  const { showToast } = useToastCtx();
  const {
    utils: { getWsTicket }
  } = authenticationStore;
  const [isCheckResource] = createResource(fetchNotificationCheckAction, {
    initialValue: true
  });
  const [isCheck, setIsCheck] = createSignal(isCheckResource());
  const [query] = createSignal({ offset: 0 });
  const [notiResource] = createResource(query, filterNotificationsAction, {
    initialValue: []
  });
  const [notifications, setNotifications] = createStore<Notification[]>([]);

  createEffect(() => {
    if (notiResource().length > 0) {
      setNotifications(produce(notis => notis.push(...notiResource())));
    }
  });

  onMount(() => {
    connect(getWsTicket() as string, noti => {
      batch(() => {
        setNotifications(produce(notis => notis.unshift(noti)));
        setIsCheck(false);
      });
    });
  });

  onCleanup(() => {
    disconnect();
  });

  createEffect(() => {
    setIsCheck(isCheckResource());
  });

  const onNotiClickHandler = () =>
    batch(() => {
      checkNotificationAction().catch(error =>
        showToast({ msg: (error as RespErr).msg, type: 'err' })
      );
      setIsCheck(true);
    });

  const onNotiCardClickHandler = (id: number) =>
    batch(() => {
      readNotificationAction(id)
        .then(() => setNotifications(n => n.id === id, 'isRead', true))
        .catch(error =>
          showToast({ msg: (error as RespErr).msg, type: 'err' })
        );
      dropdown.hide();
    });

  return (
    <>
      <button
        class="relative py-1.5 text-sm font-medium text-black hover:text-gray-500 focus:outline-none"
        ref={dropdown.initBtnRef}
        disabled={notifications.length === 0}
        classList={{ 'cursor-not-allowed': notifications.length === 0 }}
        onClick={onNotiClickHandler}
      >
        <i class="fa-solid fa-earth-americas text-2xl" />
        <Show when={isCheck() === false}>
          <div class="absolute left-4 start-4 top-1.5 block size-3 rounded-full border-2 border-white bg-red-500" />
        </Show>
      </button>
      <div
        class="z-10 hidden w-80 divide-y divide-gray-100 rounded-lg bg-white shadow"
        ref={dropdown.initRef}
      >
        <For each={notifications}>
          {notification => (
            <NotificationCard
              notification={notification}
              onClick={onNotiCardClickHandler}
            />
          )}
        </For>
      </div>
    </>
  );
};
