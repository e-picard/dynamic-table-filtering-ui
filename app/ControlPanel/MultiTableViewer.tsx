import type { Table } from "lib/Table.js"
import { TableViewer } from "~/TableViewer/TableViewer.js"

export type MultiTableViewerProps<TableName extends string> = {
  tables: Partial<{
    [Key in TableName]: Table<string, string>
  }>
}

function getGridClass(tableCount: number): string {
  switch (tableCount) {
    case 0:
    case 1:
      return "grid-cols-1 grid-rows-1";
    case 2:
      return "grid-cols-2 grid-rows-1";
    case 3:
    case 4:
      return "grid-cols-2 grid-rows-2";
    case 5:
    case 6:
      return "grid-cols-3 grid-rows-2";
    default:
      const gridCols = Math.ceil(Math.sqrt(tableCount));
      return `grid-cols-${gridCols}`;
  }
}

function tableTileStyle(tableTileAmount: number): string[] {
  return Array(tableTileAmount).fill("");
}

export function MultiTableViewer<
  TableName extends string
>({
  tables
} : MultiTableViewerProps<TableName>)
{
  const tableCount = Object.values(tables).filter(table => table !== undefined).length;
  const gridClass = getGridClass(tableCount);

  return <div className={`
    w-full
    h-full
    p-4
    grid
    gap-4
    ${gridClass}
  `}>
    {Object.entries(tables)
      .filter((entry): entry is [string, Table<string, string>] => entry[1] !== undefined)
      .map(([name, table], i, filteredEntries) =>
        <div key={name} className={tableTileStyle(filteredEntries.length)[i] + " border-2 border-gray-300 rounded-lg bg-white overflow-hidden flex flex-col"}>
          <div className="bg-gray-100 px-3 py-2 border-b border-gray-300">
            <h2 className="text-lg font-semibold text-gray-800 capitalize">{name}</h2>
            <div className="text-sm text-gray-600">{table.rows.length} rows</div>
          </div>
          <div className="flex-1 overflow-auto p-2">
            <TableViewer table={table} />
          </div>
        </div>
      )}
  </div>
}