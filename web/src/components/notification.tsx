import { Avatar } from '@/components';

type NotificationProps = {
  user: string;
  isNew: boolean;
};

export const Notification = (props: NotificationProps) => (
  <div
    class="flex justify-between p-4"
    classList={{ 'bg-indigo-100': props.isNew }}
  >
    <div class="flex items-center space-x-4">
      <Avatar />
      <div class="flex flex-col text-black">
        <a href="" class="text-sm">
          <b>{props.user}</b> dolor sit amet consectetur adipisicing elit.{' '}
        </a>
        <span class="text-xs text-gray-500">11 Jan 2023 </span>
      </div>
      {props.isNew && <i class="fa-solid fa-circle text-xs text-indigo-700" />}
    </div>
  </div>
);
