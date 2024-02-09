import { Modal } from 'flowbite';
import { batch, createEffect, createSignal, For, Show } from 'solid-js';

import { addDiscussionAction } from '@/apis';
import { Button, DiscussionForm, ShowMoreButton, TableRow } from '@/components';
import { useAuthCtx, useGameCtx, useToastCtx } from '@/context';
import { DiscussionRequest, ResponseErr } from '@/models';
import { formatTime } from '@/utils';

export const GameDiscussion = () => {
  const {
    utils: { isAuth }
  } = useAuthCtx();
  const {
    utils: { getGameId },
    discussions: {
      reset,
      dispatch: { fetchMore },
      utils: { showMore },
      data,
      count,
      recount
    }
  } = useGameCtx();
  const { dispatch } = useToastCtx();
  const [modalRef, setModalRef] = createSignal<HTMLDivElement>();
  const [modal, setModal] = createSignal<Modal>();

  createEffect(() => {
    setModal(new Modal(modalRef()));
  });

  const batchSubmitHandler = () =>
    batch(() => {
      reset();
      modal()?.hide();
      dispatch.showToast({ msg: 'Discussion Added', type: 'Ok' });
    });

  const onSubmitHandler = (discussion: DiscussionRequest) =>
    addDiscussionAction(discussion, getGameId())
      .then(batchSubmitHandler)
      .then(recount)
      .catch((error: ResponseErr) =>
        dispatch.showToast({ msg: error.msg, type: 'Err' })
      ) as unknown;

  return (
    <>
      <div class="flex flex-col">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div class="overflow-hidden border border-gray-200 md:rounded-lg">
              <div class="min-w-full divide-y divide-gray-200">
                <div class="flex items-center justify-between px-8 py-3.5 text-left text-base font-bold text-black rtl:text-right">
                  <p class="text-lg">Total {count()} discussions</p>
                  <Show when={isAuth}>
                    <Button
                      withIcon="fa-solid fa-plus"
                      title="New"
                      customStyle="hover:text-white hover:bg-green-500 float-right text-green-500 font-bold"
                      onClickHandler={() => modal()?.show()}
                    />
                  </Show>
                </div>
                <DiscussionForm
                  ref={setModalRef}
                  onCloseHandler={() => modal()?.hide()}
                  onSubmitHandler={onSubmitHandler}
                />
                <For each={data}>
                  {d => (
                    <TableRow
                      title={d.title}
                      date={formatTime(d.createdAt)}
                      username={d.userName}
                      url={`/games/${getGameId()}/discussion/${d.id}`}
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
          </div>
        </div>
      </div>
    </>
  );
};
