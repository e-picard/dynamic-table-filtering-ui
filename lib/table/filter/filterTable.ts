import type { Table } from "lib/Table.js";
import { createRowFilterPredicate, type RowFilterCriteria } from "./createRowFilterPredicate.js";

export type Predicate<T> = (value: T) => boolean;

export function filterTable<
  T extends Table<string, T["columnNames"][number]>
>(
  table: T,
  criteria: RowFilterCriteria<T["columnNames"][number]>
): T {
  type ColumnName = T["columnNames"][number];
  type PrimaryKey = T["primaryKey"];
  const rowFilterPredicate = createRowFilterPredicate(table, criteria);

  return {
    primaryKey: table.primaryKey,
    columnNames: table.columnNames,
    rows: table.rows.filter(rowFilterPredicate)
  } satisfies Table<ColumnName, PrimaryKey> as T;
}