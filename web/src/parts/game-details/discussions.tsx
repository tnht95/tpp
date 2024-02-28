import { For, Show } from 'solid-js';

import {
  Button,
  DiscussionForm,
  LoadingSpinner,
  ShowMoreButton,
  TableRow
} from '@/components';
import { GameDiscussionsProvider, useGameDiscussionsCtx } from '@/context';
import { authenticationStore } from '@/store';
import { formatTime } from '@/utils';

export const GameDetailsDiscussion = () => (
  <GameDiscussionsProvider>
    <GameDetailsDiscussionInner />
  </GameDiscussionsProvider>
);

const GameDetailsDiscussionInner = () => {
  const {
    utils: { isAuth }
  } = authenticationStore;
  const {
    discussions,
    count,
    dispatch: { fetchMore, add },
    utils: { showMore, loading, gameId },
    modal: { show, hide, initRef }
  } = useGameDiscussionsCtx();
  return (
    <div class="flex flex-col">
      <Show when={!loading()} fallback={<LoadingSpinner />}>
        <div class="rounded-lg border border-gray-200">
          <div class="min-w-full divide-y divide-gray-200">
            <div class="flex items-center justify-between px-8 py-3.5 text-left text-base text-black rtl:text-right">
              <p class="text-lg font-bold">Total {count()} discussion(s)</p>
              <Show when={isAuth()}>
                <Button
                  withIcon="fa-solid fa-plus"
                  title="New"
                  customStyle="hover:text-white hover:bg-green-500 float-right text-green-500 font-bold"
                  onClickHandler={show}
                />
                <DiscussionForm
                  ref={initRef}
                  onCloseHandler={hide}
                  onSubmitHandler={add}
                />
              </Show>
            </div>
            <For each={discussions}>
              {d => (
                <TableRow
                  title={d.title}
                  date={formatTime(d.createdAt)}
                  username={d.userName}
                  url={`/games/${gameId}/discussions/${d.id}`}
                />
              )}
            </For>
            <Show when={showMore()}>
              <ShowMoreButton
                onClick={fetchMore}
                vertical
                customStyle="border-none py-3"
              />
            </Show>
          </div>
        </div>
      </Show>
    </div>
  );
};
