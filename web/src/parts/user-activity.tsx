import { Activity } from '@/components';

export const UserActivity = () => (
  <div class="rounded-xl border bg-white p-3">
    <div class="px-8 pt-3">
      <div class="mb-5 items-center space-x-2 font-semibold leading-8 text-gray-900">
        <i class="fa-regular fa-newspaper text-lg text-green-400" />
        <span class="tracking-wide">Activity</span>
      </div>
      <ol class="relative border-s border-gray-200">
        <Activity title="Bob upload this game" date="09 Jun 2023" />
        <Activity title="Bob upload this game" date="09 Jun 2023" />
        <Activity title="Bob upload this game" date="09 Jun 2023" />
        <Activity title="Bob upload this game" date="09 Jun 2023" />
      </ol>
    </div>
  </div>
);
