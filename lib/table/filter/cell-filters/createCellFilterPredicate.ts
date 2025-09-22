import type { LengthCellFilterCriteria } from "./lengthCellFilterCriteria.js";
import type { PatternCellFilterCriteria } from "./patternCellFilterCriteria.js";
import type { RangeCellFilterCriteria } from "./rangeCellFilterCriteria.js";
import type { ValueCellFilterCriteria } from "./valueCellFilterCriteria.js";

export type CellFilterCriteria =
  ValueCellFilterCriteria |
  LengthCellFilterCriteria |
  RangeCellFilterCriteria |
  PatternCellFilterCriteria;

export function createCellFilterPredicate(filter: CellFilterCriteria) {
  switch (filter.type) {
    case "value":
      return (value: string) => filter.values.has(value);

    case "length":
      return (value: string) =>
        value.length >= filter.minLength &&
        value.length <= filter.maxLength;
    
    case "range":
      return (value: string) => {
        const valueNumber = parseFloat(value);
        return !Number.isNaN(valueNumber) &&
          valueNumber >= filter.minInclusive &&
          valueNumber <= filter.maxInclusive
      }
    
    case "pattern":
      return (value: string) => filter.pattern.test(value)
  }
}
