export const Selects = () => (
  <form>
    <select
      name="sort"
      id="sort"
      class="border-black border-2 ml-2 p-1 rounded"
    >
      <option disabled selected value="">
        Sort by
      </option>
      <option value="date">Date</option>
      <option value="name">Name</option>
      <option value="rating">Rating</option>
    </select>
  </form>
);
