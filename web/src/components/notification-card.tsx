import { Show } from 'solid-js';

import { Avatar } from '@/components';
import { Notification, NotificationType } from '@/models';
import { formatTime } from '@/utils';

type Props = {
  notification: Notification;
  onClick?: (id: Notification) => void;
};

const content: Record<NotificationType, string> = {
  likePost: 'liked your post!',
  likeDiscussion: 'liked your discussion!',
  likeCommentBlog: 'liked a comment on your blog!',
  likeCommentPost: 'liked your comment on a post!',
  likeCommentDiscussion: 'liked your comment on a discussion!',
  commentBlog: 'commented on your blog!',
  commentPost: 'commented on your post!',
  commentDiscussion: 'commented on your discussion!',
  commentTagBlog: 'mentioned you in a comment on a blog!',
  commentTagPost: 'mentioned you in a comment on a post!',
  commentTagDiscussion: 'mentioned you in a comment on a discussion!',
  gameDiscussion: 'created a new discussion in your game!',
  subscribe: 'subscribed to you!',
  userAddedGame: 'added a new game!',
  userUpdatedGame: 'updated a game!',
  userPost: 'posted something new!',
  voteGame: 'voted on your game!'
};

const buildUrl = (
  targetType: NotificationType,
  targetId: string,
  parentId: string,
  userId: number
): string => {
  switch (targetType) {
    case 'likePost': {
      return `/posts/${targetId}`;
    }
    case 'likeDiscussion': {
      return `/games/${parentId}/discussions/${targetId}`;
    }
    case 'likeCommentBlog': {
      return `/blogs/${targetId}`;
    }
    case 'likeCommentPost': {
      return `/posts/${targetId}`;
    }
    case 'likeCommentDiscussion': {
      return `/games/${parentId}/discussions/${targetId}`;
    }
    case 'commentBlog': {
      return `/blogs/${targetId}`;
    }
    case 'commentPost': {
      return `/posts/${targetId}`;
    }
    case 'commentDiscussion': {
      return `/games/${parentId}/discussions/${targetId}`;
    }
    case 'commentTagPost': {
      return `/posts/${targetId}`;
    }
    case 'commentTagBlog': {
      return `/blogs/${targetId}`;
    }
    case 'commentTagDiscussion': {
      return `/games/${parentId}/discussions/${targetId}`;
    }
    case 'gameDiscussion': {
      return `/games/${parentId}/discussions/${targetId}`;
    }
    case 'subscribe': {
      return `/users/${userId}`;
    }
    case 'userAddedGame':
    case 'userUpdatedGame':
    case 'voteGame': {
      return `/games/${targetId}/info`;
    }
    case 'userPost': {
      return `/posts/${targetId}`;
    }
  }
};

export const NotificationCard = (props: Props) => (
  <div
    class="flex justify-between p-4 hover:bg-gray-100"
    classList={{ 'bg-indigo-100': !props.notification.isRead }}
  >
    <div class="flex flex-1 items-center gap-3">
      <Avatar
        img={props.notification.byUserNameAvatar}
        userId={props.notification.byUserId}
      />
      <a
        href={buildUrl(
          props.notification.targetType,
          props.notification.targetId,
          props.notification.parentTargetId,
          props.notification.byUserId
        )}
        class="flex flex-1 flex-col text-sm text-black"
        onClick={() => props.onClick && props.onClick(props.notification)}
      >
        <div class="">
          <b>{props.notification.byUserName}</b>{' '}
          {content[props.notification.targetType]}
        </div>
        <span class="text-xs text-gray-500">
          {formatTime(props.notification.createdAt)}
        </span>
      </a>
      <Show when={!props.notification.isRead}>
        <i class="fa-solid fa-circle text-xs text-indigo-700" />
      </Show>
    </div>
  </div>
);
