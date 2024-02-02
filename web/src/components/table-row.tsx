type TableRowProps = {
  title: string;
  username: string;
  date: string;
  url: string;
};
export const TableRow = (props: TableRowProps) => (
  <div class="hover:bg-gray-100">
    <div class="whitespace-nowrap px-8 py-4 text-sm text-gray-500">
      <div>
        <a href={props.url} class="text-lg font-bold text-gray-800">
          {props.title}
        </a>
        <p class="text-xs font-normal text-gray-400">
          {props.date} by {props.username}
        </p>
      </div>
    </div>
  </div>
);
