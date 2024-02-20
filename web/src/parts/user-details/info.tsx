import { batch, createSignal, Show } from 'solid-js';

import { subscribeAction, unSubscribeAction } from '@/apis';
import { PillButton } from '@/components';
import { useToastCtx, useUserDetailsCtx } from '@/context';
import { RespErr } from '@/models';
import { authenticationStore } from '@/store';

export const UserDetailsInfo = () => {
  const {
    utils: { isSameUser, isAuth }
  } = authenticationStore;
  const { showToast } = useToastCtx();
  const {
    user,
    utils: { userId }
  } = useUserDetailsCtx();

  const [isLoading, setIsLoading] = createSignal(false);
  const [isSubscribed, setIsSubscribed] = createSignal(user().isSubscribed);
  const [subscribers, setSubscribers] = createSignal(user().subscribers);

  const subscribeBatch = () =>
    batch(() => {
      setSubscribers(prev => (isSubscribed() ? prev - 1 : prev + 1));
      setIsSubscribed(prev => !prev);
    });

  const onSubscribeHandler = () => {
    setIsLoading(true);

    const actionPromise = isSubscribed()
      ? unSubscribeAction(userId)
      : subscribeAction(userId);

    actionPromise
      .then(subscribeBatch)
      .catch(error => showToast({ msg: (error as RespErr).msg, type: 'err' }))
      .finally(() => setIsLoading(false)) as unknown;
  };

  return (
    <div class="rounded-xl border bg-white py-6">
      <div class="flex justify-center">
        <img
          src={user().avatar}
          class="absolute -m-16 max-w-[150px] rounded-full border-8 border-white"
          alt="d"
        />
      </div>
      <div class="mt-20 flex justify-center">
        <h3 class="text-2xl font-bold leading-normal text-gray-700">
          {user().name}
        </h3>
      </div>
      <div class="mt-2 flex flex-col items-center gap-2">
        <div class="text-sm text-gray-500">
          <i class="fa-solid fa-link mr-2" />
          <a href={user().githubUrl} target="_blank">
            {user().githubUrl}
          </a>
        </div>
        <Show when={user().bio}>
          <div>{user().bio}</div>
        </Show>
      </div>
      <div class="mt-6 border-t border-gray-200 pt-6">
        <div class="flex justify-center">
          <PillButton
            title="Subscribe"
            icon="fa-solid fa-plus"
            number={subscribers()}
            disabled={
              !isAuth() || isSameUser(Number.parseInt(userId)) || isLoading()
            }
            clicked={isSubscribed() === true}
            onClick={onSubscribeHandler}
            titleAfterClicked="Subscribed"
            iconAfterClicked="fa-solid fa-minus"
          />
        </div>
      </div>
    </div>
  );
};
