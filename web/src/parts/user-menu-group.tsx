import { Avatar, Notification } from '@/components';

export const UserMenuGroup = () => (
  <div class="flex gap-7 items-center">
    <button
      id="dropdownNotificationButton"
      data-dropdown-toggle="dropdownNotification"
      class="py-1.5 relative text-sm font-medium  text-black hover:text-gray-500 focus:outline-none "
      type="button"
    >
      <i class="fa-solid fa-earth-americas text-2xl" />

      <div class="absolute block w-3 h-3 bg-red-500 border-2 border-white rounded-full left-4 top-1.5 start-4" />
    </button>

    <div
      id="dropdownNotification"
      class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-80"
    >
      <Notification user="Bob@gmail.com" isNew={false} />
      <Notification user="Bob@gmail.com" isNew={true} />
    </div>

    <button
      id="dropdownAvatarNameButton"
      data-dropdown-toggle="dropdownAvatarName"
      class="py-0.5 mr-10 flex text-white font-bold  items-center text-sm pe-1  hover:text-blue-600"
      type="button"
    >
      <span class="sr-only">Open user menu</span>
      <Avatar />
    </button>

    <div
      id="dropdownAvatarName"
      class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-52 "
    >
      <div class="px-4 py-5 text-sm text-gray-900">
        <div class="truncate font-bold  ">name@flowbite.com</div>
      </div>
      <div
        class=" text-sm text-gray-700 "
        aria-labelledby="dropdownInformdropdownAvatarNameButtonationButton"
      >
        <div class="py-5 hover:bg-gray-100 flex items-center px-4 gap-2">
          <i class="fa-solid fa-user" />
          <a href="/users/d" class=" ">
            My Page
          </a>
        </div>
      </div>
      <div class="py-5 hover:bg-gray-100 flex text-gray-700 items-center px-4 rounded-b-lg gap-2">
        <i class="fa-solid fa-arrow-right-from-bracket text-sm " />
        <a href="#" class="block  text-sm   ">
          Sign out
        </a>
      </div>
    </div>
  </div>
);
