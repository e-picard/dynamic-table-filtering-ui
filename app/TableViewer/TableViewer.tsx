import type { Table } from "lib/Table";

export type TableProps<ColumnName extends string, PrimaryKey extends ColumnName> = {
  table: Table<ColumnName, PrimaryKey>
}

export function TableViewer<ColumnName extends string, PrimaryKey extends ColumnName>(
  { table }: TableProps<ColumnName, PrimaryKey>
)
{
  const rowStyle = `even:bg-gray-50 hover:bg-blue-50`
  const cellStyle = `px-2 py-1 border-b border-gray-200`;

  const header =
  <tr key="header" className="bg-gray-100 border-b-2 border-gray-300">
    {table.columnNames.map((columnName) =>
      <th key={columnName} className="px-2 py-2 text-left font-semibold text-gray-700 border-b border-gray-200">
        {columnName}
      </th>)
    }
  </tr>

  const rows = table.rows.map((row) =>
    <tr key={row[table.primaryKey]} className={rowStyle}>
    {table.columnNames.map((columnName) => 
      <td key={columnName} className={cellStyle}>{row[columnName]}</td>
    )}
    </tr>
  );

  return <table className="
    w-full
    text-left
    text-sm
    border-collapse
  ">
    <thead>
      {header}
    </thead>
    <tbody>
      {rows}
    </tbody>
  </table>
}