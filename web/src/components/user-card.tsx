import { Avatar, EllipsisText } from '@/components';
import { UserSummary } from '@/models';

export type UserCardProps = {
  user: UserSummary;
};

export const UserCard = (props: UserCardProps) => (
  <div class="flex h-[212px] w-48 flex-col items-center justify-center rounded-lg border border-indigo-900 px-4 py-10">
    <Avatar img={props.user.avatar} userId={props.user.id} />
    <EllipsisText maxWidth="max-w-36" customStyle="font-bold mt-2">
      {props.user.name}
    </EllipsisText>
    <p class="text-xs text-gray-400">23 followers</p>
  </div>
);
