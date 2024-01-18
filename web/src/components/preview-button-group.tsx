type PreviewButtonGroupProp = {
  onClick: () => void;
  isEditMode: boolean;
};

export const PreviewButtonGroup = (props: PreviewButtonGroupProp) => (
  <div class="w-full md:w-full flex items-center px-3">
    <div class="flex text-gray-400 items-center ">
      <i class="fa-regular fa-circle-check mr-2" />
      Support some markdowns
    </div>
    <div class="flex items-start  text-gray-700 px-2 mr-auto" />
    <div class="-mr-1">
      <button
        type="button"
        class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
        onClick={() => props.onClick()}
      >
        {props.isEditMode ? 'Preview' : 'Edit'}
      </button>
      <button
        type="button"
        class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
      >
        Post
      </button>
    </div>
  </div>
);
