type TableRowProps = {
  title: string;
  user: string;
  date: string;
};
export const TableRow = (props: TableRowProps) => (
  <tr class="hover:bg-gray-100 ">
    <td class="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
      <div>
        <a href="" class="text-base font-bold text-gray-800  ">
          {props.title}
        </a>
        <p class="text-xs font-normal text-gray-600 ">
          {props.date} by {props.user}
        </p>
      </div>
    </td>
  </tr>
);
