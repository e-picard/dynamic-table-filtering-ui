import { createCellFilterPredicate, type CellFilterCriteria } from "./cell-filters/createCellFilterPredicate.js";
import type { Predicate } from "./filterTable.js";

function createForEveryColumnFilterPredicate(
  cellCriteria: CellFilterCriteria[]
): Predicate<string> {
  const filterPredicates = cellCriteria.map(createCellFilterPredicate);
  if (filterPredicates.length == 0) return () => true;
  return (value: string) => {
    for (const filterPredicate of filterPredicates) {
      if (!filterPredicate(value)) return false;
    }
    return true;
  }
}

function createForAnyColumnFilterPredicate(
  cellCriteria: CellFilterCriteria[]
): Predicate<string> {
  const filterPredicates = cellCriteria.map(createCellFilterPredicate);
  if (filterPredicates.length == 0) return () => true;
  return (value: string) => {
    for (const filterPredicate of filterPredicates) {
      if (filterPredicate(value)) return true;
    }
    return false;
  }
}

export function createColumnFilterPredicate(
  { quantification, cellCriterias } : ColumnFilterCriteria
): Predicate<string> {
  if (quantification == "for_every")
    return createForEveryColumnFilterPredicate(cellCriterias);
  else
    return createForAnyColumnFilterPredicate(cellCriterias);
}
export type ColumnFilterCriteria = {
  quantification: "for_every" | "for_any"
  cellCriterias: CellFilterCriteria[]
}
