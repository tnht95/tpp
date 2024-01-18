type PreviewButtonGroupProp = {
  onClick: () => void;
  isEditMode: boolean;
};

export const PreviewButtonGroup = (props: PreviewButtonGroupProp) => (
  <div class="flex w-full items-center px-3 md:w-full">
    <div class="mr-auto flex items-start px-2 text-gray-700" />
    <div class="-mr-1">
      <button
        type="button"
        class="me-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 "
        onClick={() => props.onClick()}
      >
        {props.isEditMode ? 'Preview' : 'Edit'}
      </button>
      <button
        type="button"
        class="me-2 rounded-lg bg-green-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300"
      >
        Post
      </button>
    </div>
  </div>
);
