export const Selects = () => (
  <div class="flex items-center">
    <select
      id="countries"
      class="block rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 "
    >
      <option disabled selected>
        Sort by
      </option>
      <option value="name">Name</option>
      <option value="star">Star</option>
      <option value="date">Date</option>
    </select>
  </div>
);
