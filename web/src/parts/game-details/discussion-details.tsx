import { Avatar, DiscussionForm, Markdown, OptionButton } from '@/components';
import {
  CommentsProvider,
  GameDiscussionDetailsProvider,
  useAuthCtx,
  useGameDiscussionDetailsCtx
} from '@/context';
import { formatTime } from '@/utils';

import { GameDetailsDiscussionDetailsComment } from './discussion-details-comment';

export const GameDetailsDiscussionDetails = () => (
  <GameDiscussionDetailsProvider>
    <GameDetailsDiscussionDetailsInner />
  </GameDiscussionDetailsProvider>
);

const GameDetailsDiscussionDetailsInner = () => {
  const {
    utils: { isSameUser }
  } = useAuthCtx();
  const {
    discussion,
    dispatch: { edit, del },
    modal: { initRef, show, hide },
    utils: { discussionId }
  } = useGameDiscussionDetailsCtx();
  return (
    <>
      <DiscussionForm
        ref={initRef}
        onCloseHandler={hide}
        onSubmitHandler={edit}
        discussion={discussion()}
      />
      <div class="flex flex-col gap-9 px-5">
        <div class="border-b pb-5">
          <div class="flex items-center">
            <p class="mr-3 text-3xl font-semibold">{discussion()?.title}</p>
            <OptionButton
              isOwner={isSameUser(discussion()?.userId as number)}
              onDelete={del}
              id={''}
              onEdit={show}
            />
          </div>
          <p class="mt-1 text-base text-gray-400">
            On {formatTime(discussion()?.createdAt as string)} by{' '}
            <a
              target="_blank"
              href={`/users/${discussion()?.userId}`}
              class="font-bold hover:text-gray-600 hover:underline"
            >
              {discussion()?.userName}
            </a>
          </p>
        </div>
        <div class="flex gap-5 border-b pb-9">
          <Avatar
            img={discussion()?.userAvatar as string}
            userId={discussion()?.userId as number}
          />
          <div class="w-full rounded-lg border-2 border-dashed p-5">
            <Markdown content={discussion()?.content as string} />
          </div>
        </div>
        <CommentsProvider targetType="Discussion" targetId={discussionId}>
          <GameDetailsDiscussionDetailsComment />
        </CommentsProvider>
      </div>
    </>
  );
};
