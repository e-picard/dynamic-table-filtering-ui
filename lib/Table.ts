export type TableRow<ColumnName extends string> = {
  [K in ColumnName]: string
}

export type Table<ColumnName extends string, PrimaryKey extends ColumnName> = {
  readonly primaryKey: PrimaryKey,
  readonly columnNames: [ColumnName, ...ColumnName[]],
  rows: TableRow<ColumnName>[]
}