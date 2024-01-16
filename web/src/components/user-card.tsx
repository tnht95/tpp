import { Avatar , EllipsisText } from '@/components';

export const UserCard = () => (
  <div class="flex flex-col items-center border border-indigo-900 rounded-lg px-4 py-10 justify-center">
    <Avatar />

    <EllipsisText maxWidth="max-w-36" customStyle="font-bold mt-2">
      JennySkywalker@gmail.com
    </EllipsisText>
    <p class="text-xs text-gray-400 ">23 followers</p>
  </div>
);
