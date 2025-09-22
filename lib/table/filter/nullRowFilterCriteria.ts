import type { RowFilterCriteria } from "./createRowFilterPredicate.js";

export function nullRowFilterCriteria<
  ColumnName extends string
>(): RowFilterCriteria<ColumnName>
{
  return {
    quantification: "for_every",
    columnCriterias: {}
  }
}