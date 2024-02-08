type PreviewButtonGroupProps = {
  onPreviewHandler: () => void;
  isEditMode: boolean;
};

export const PreviewButtonGroup = (props: PreviewButtonGroupProps) => (
  <div class="flex w-full items-center justify-end gap-3">
    <button
      type="button"
      class="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200"
      onClick={() => props.onPreviewHandler()}
    >
      {props.isEditMode ? 'Preview' : 'Edit'}
    </button>
    <button
      type="submit"
      class="rounded-lg bg-green-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300"
    >
      Post
    </button>
  </div>
);
