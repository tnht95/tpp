import { Modal } from 'flowbite';
import { batch, createEffect, createSignal, For, Show } from 'solid-js';
import { produce } from 'solid-js/store';

import { addDiscussionAction } from '@/apis';
import { Button, DiscussionForm, ShowMoreButton, TableRow } from '@/components';
import { LIMIT, OFFSET } from '@/constant';
import { useAuthCtx, useGameCtx, useToastCtx } from '@/context';
import { AddDiscussion, ResponseErr } from '@/models';
import { formatTime } from '@/utils';

export const GameDiscussion = () => {
  const {
    utils: { isAuth }
  } = useAuthCtx();
  const {
    utils: { getGameId },
    discussion: { setDiscussions, currentDataBatch, setQueryValue, data }
  } = useGameCtx();
  const { dispatch } = useToastCtx();
  const [modalRef, setModalRef] = createSignal<HTMLDivElement>();
  const [modal, setModal] = createSignal<Modal>();

  createEffect(() => {
    setModal(new Modal(modalRef()));
    if (currentDataBatch().length > 0) {
      setDiscussions(
        produce(oldValues => oldValues.push(...currentDataBatch()))
      );
    }
  });

  const batchSubmitHandler = () =>
    batch(() => {
      setDiscussions([]);
      setQueryValue(oldValues => ({
        ...oldValues,
        offset: 0
      }));
      modal()?.hide();
    });

  const onSubmitHandler = (discussion: AddDiscussion) =>
    addDiscussionAction(discussion)
      .then(batchSubmitHandler)
      .catch((error: ResponseErr) =>
        dispatch.showToast({ msg: error.msg, type: 'Err' })
      ) as unknown;

  const onShowMoreHandler = () => {
    setQueryValue(oldValue => ({
      ...oldValue,
      offset: (oldValue.offset as number) + OFFSET
    }));
  };

  return (
    <>
      <div class="flex flex-col">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div class="overflow-hidden border border-gray-200 md:rounded-lg">
              <div class="min-w-full divide-y divide-gray-200">
                <div class="flex items-center justify-between px-8 py-3.5 text-left text-base font-bold text-black rtl:text-right">
                  <p class="text-lg">Total 2 discussions</p>
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
                <Show when={currentDataBatch().length == LIMIT}>
                  <ShowMoreButton
                    onClick={onShowMoreHandler}
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
