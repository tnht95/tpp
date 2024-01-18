type TableRowProps = {
  title: string;
  user: string;
  date: string;
};
export const TableRow = (props: TableRowProps) => (
  <div class="hover:bg-gray-100 ">
    <div class="px-8 py-4 text-sm text-gray-500 whitespace-nowrap">
      <div>
        <a href="" class="text-lg font-bold text-gray-800 ">
          {props.title}
        </a>
        <p class="text-xs font-normal text-gray-400 ">
          {props.date} by {props.user}
        </p>
      </div>
    </div>
  </div>
);
