export const Selects = () => (
  <div class="flex items-center">
    <select
      id="countries"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 "
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
