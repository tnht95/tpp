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
import { PAGINATION } from '@/constant';
import { useToastCtx } from '@/context';
import { Notification, RespErr } from '@/models';
import { authenticationStore } from '@/store';
import { connect, disconnect, useDropdownUtils } from '@/utils';

export const UserMenuGroupNotiBtn = () => {
  const dropdown = useDropdownUtils({
    onHide: () => setIsNotiOpen(false),
    onShow: () => setIsNotiOpen(true)
  });
  const { showToast } = useToastCtx();
  const {
    utils: { getWsTicket }
  } = authenticationStore;
  const [isCheckResource] = createResource(fetchNotificationCheckAction, {
    initialValue: true
  });
  const [isNotiOpen, setIsNotiOpen] = createSignal(false);
  const [isCheck, setIsCheck] = createSignal(isCheckResource());
  const [reachedBottom, setReachedBottom] = createSignal(false);
  const [query, setQuery] = createSignal({ offset: 0 });
  const [notiResource] = createResource(query, filterNotificationsAction, {
    initialValue: []
  });
  const [notifications, setNotifications] = createStore<Notification[]>([]);
  let newNotiCount = 0;

  onMount(() => {
    connect(getWsTicket() as string, handleNewNoti);
    const ddRef = dropdown.dropdownRef();
    if (ddRef) {
      ddRef.addEventListener('scroll', handleScroll);
    }
  });

  onCleanup(() => {
    disconnect();
    const ddRef = dropdown.dropdownRef();
    if (ddRef) {
      ddRef.removeEventListener('scroll', handleScroll);
    }
  });

  createEffect(() => {
    setIsCheck(isCheckResource());
  });

  createEffect(() => {
    if (notiResource().length > 0) {
      batch(() => {
        setNotifications(produce(notis => notis.push(...notiResource())));
        setReachedBottom(false);
      });
    }
  });

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } =
      dropdown.dropdownRef() as HTMLDivElement;
    const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
    if (scrollPercentage > 90 && !reachedBottom()) {
      batch(() => {
        setQuery(p => ({ ...p, offset: p.offset + PAGINATION + newNotiCount }));
        setReachedBottom(true);
        newNotiCount = 0;
      });
    }
  };

  const handleNewNoti = (noti: Notification) =>
    batch(() => {
      if (noti.id > (notifications[0]?.id || 0)) {
        setNotifications(produce(notis => notis.unshift(noti)));
        setIsCheck(false);
        newNotiCount++;
      }
    });

  const onNotiClickHandler = () =>
    batch(() => {
      if (!isCheck()) {
        checkNotificationAction().catch(error =>
          showToast({ msg: (error as RespErr).msg, type: 'err' })
        );
        setIsCheck(true);
        setIsNotiOpen(true);
      }
    });

  const onNotiCardClickHandler = (noti: Notification) =>
    batch(() => {
      if (!noti.isRead) {
        readNotificationAction(noti.id)
          .then(() => setNotifications(n => n.id === noti.id, 'isRead', true))
          .catch(error =>
            showToast({ msg: (error as RespErr).msg, type: 'err' })
          );
      }
      dropdown.hide();
    });

  return (
    <>
      <button
        class={`relative py-1.5 text-sm font-medium  ${isNotiOpen() ? 'text-gray-300' : 'text-black'} hover:text-gray-500 focus:outline-none`}
        ref={dropdown.initBtnRef}
        onClick={onNotiClickHandler}
      >
        <i class="fa-solid fa-earth-americas text-2xl" />
        <Show when={!isCheck()}>
          <div class="absolute left-4 start-4 top-1.5 block size-3 rounded-full border-2 border-white bg-red-500" />
        </Show>
      </button>
      <div
        class="z-10 hidden max-h-96 w-96 divide-y divide-gray-100 overflow-y-auto rounded-lg bg-white shadow"
        ref={dropdown.initRef}
      >
        <Show
          when={notifications.length > 0}
          fallback={
            <div class="flex h-20 items-center justify-center text-gray-300">
              <p>---Nothing to show---</p>
            </div>
          }
        >
          <For each={notifications}>
            {notification => (
              <NotificationCard
                notification={notification}
                onClick={onNotiCardClickHandler}
              />
            )}
          </For>
        </Show>
      </div>
    </>
  );
};
