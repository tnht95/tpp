import { UserMenuGroupNotiBtn } from './noti-btn';
import { UserMenuGroupUserBtn } from './user-btn';

export const UserMenuGroup = () => (
  <div class="flex items-center gap-7">
    <UserMenuGroupNotiBtn />
    <UserMenuGroupUserBtn />
  </div>
);
