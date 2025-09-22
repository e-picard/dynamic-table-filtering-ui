import Papaparse from "papaparse";
import type { Table, TableRow } from "./Table.js";

export function tableOfCsv<ColumnName extends string, PrimaryKey extends ColumnName>(
  primaryKey: PrimaryKey,
  columnNames: [ColumnName, ...ColumnName[]],
  csv: string
): Table<ColumnName, PrimaryKey> {

  const parseResult = Papaparse.parse<TableRow<ColumnName>>(csv, {
    header: true
  });

  if (parseResult.meta.fields == undefined) throw new Error("Expected CSV headers");
  const headerRow = parseResult.meta.fields!;

  // Ensure column names are correct
  if (!columnNames.every((value, i) => value == headerRow[i])) {
    throw new Error(`Expected ${columnNames} to equal ${parseResult.meta.fields}`);
  }
  for (let i = 0; i < columnNames.length; i++) {
    if (columnNames[i] != parseResult.meta.fields[i])
      throw new Error(
        `Expected column header "${headerRow[i]}" to equal "${columnNames[i]}"
      `);
  }

  return {
    primaryKey,
    columnNames,
    rows: parseResult.data
  }
}
