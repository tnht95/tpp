import { Avatar, EllipsisText } from '@/components';
import { UserSummary } from '@/models';

type Props = {
  user: UserSummary;
};

export const UserCard = (props: Props) => (
  <div class="flex h-[212px] w-48 flex-col items-center justify-center rounded-lg border border-indigo-900 px-4 py-10">
    <Avatar img={props.user.avatar} userId={props.user.id} />
    <EllipsisText maxWidth="max-w-36" customStyle="font-bold mt-2">
      {props.user.name}
    </EllipsisText>
  </div>
);
