import { Notification } from '@/components';
import { useDropdownUtils } from '@/utils';

export const UserMenuGroupNotiBtn = () => {
  const dropdown = useDropdownUtils();
  return (
    <>
      <button
        class="relative py-1.5 text-sm font-medium text-black hover:text-gray-500 focus:outline-none"
        ref={dropdown.initBtnRef}
      >
        <i class="fa-solid fa-earth-americas text-2xl" />
        <div class="absolute left-4 start-4 top-1.5 block size-3 rounded-full border-2 border-white bg-red-500" />
      </button>
      <div
        class="z-10 hidden w-80 divide-y divide-gray-100 rounded-lg bg-white shadow"
        ref={dropdown.initRef}
      >
        <Notification user="Bob@gmail.com" isNew={false} />
        <Notification user="Bob@gmail.com" isNew={true} />
      </div>
    </>
  );
};
