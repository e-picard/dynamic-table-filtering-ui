import { objectOfArray } from "lib/objectOfArray.js";
import type { ColumnFilterCriteria } from "./createColumnFilterPredicate.js";
import type { Predicate } from "./filterTable.js";
import { createColumnFilterPredicate } from "./createColumnFilterPredicate.js";
import type { Table, TableRow } from "lib/Table.js";

export type RowFilterCriteria<ColumnName extends string> = {
    quantification: "for_every" | "for_any",
    columnCriterias: { [K in ColumnName]?: ColumnFilterCriteria }
}

function createColumnFilterPredicates<
  ColumnName extends string,
  PrimaryKey extends ColumnName
>(table: Table<ColumnName, PrimaryKey>, columnCriterias: RowFilterCriteria<ColumnName>["columnCriterias"]) {
  return objectOfArray(
    table.columnNames,
    (columnName) => {
      const columnCriteria = columnCriterias[columnName];
      return [
        columnName,
        !!columnCriteria ?
          createColumnFilterPredicate(columnCriterias[columnName]!) :
          undefined
      ]
    }
  );
}

function createForEveryRowFilterPredicate<
  ColumnName extends string,
  PrimaryKey extends ColumnName
>(
  table: Table<ColumnName, PrimaryKey>,
  columnFilterPredicates: {
    [Key in ColumnName]?: Predicate<string>
  }
): Predicate<TableRow<ColumnName>> {

  return (row: TableRow<ColumnName>) => {
    for (const columnName of table.columnNames) {
      const columnFilterPredicate = columnFilterPredicates[columnName];
      if (columnFilterPredicate == undefined) continue;

      if (!columnFilterPredicate(row[columnName])) return false;
    }
    return true;
  }
}

function createForAnyRowFilterPredicate<
  ColumnName extends string,
  PrimaryKey extends ColumnName
>(
  table: Table<ColumnName, PrimaryKey>,
  columnFilterPredicates: {
    [Key in ColumnName]?: Predicate<string>
  }
): Predicate<TableRow<ColumnName>> {
  return (row: TableRow<ColumnName>) => {
    for (const columnName of table.columnNames) {
      const columnFilterPredicate = columnFilterPredicates[columnName];
      if (columnFilterPredicate == undefined) continue;

      if (columnFilterPredicate(row[columnName])) return true;
    }
    return false;
  }
}

export function createRowFilterPredicate<
  ColumnName extends string,
  PrimaryKey extends ColumnName
>(
  table: Table<ColumnName, PrimaryKey>,
  criteria: RowFilterCriteria<ColumnName>
): (row: TableRow<ColumnName>) => boolean
{
  const columnFilterPredicates = objectOfArray(table.columnNames, (columnName) => {
    const columnCriteria = criteria.columnCriterias[columnName];
    return [
      columnName,
      !!columnCriteria ?
        createColumnFilterPredicate(criteria.columnCriterias[columnName]!) :
        undefined
    ]
  });

  if (criteria.quantification == "for_every")
    return createForEveryRowFilterPredicate(table, columnFilterPredicates);
  else
    return createForAnyRowFilterPredicate(table, columnFilterPredicates);
}