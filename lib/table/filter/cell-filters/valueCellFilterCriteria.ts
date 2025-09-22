export type ValueCellFilterCriteria = {
  type: "value",
  values: Set<string>
}

export function valueCellFilterCriteria(values: ValueCellFilterCriteria["values"]): ValueCellFilterCriteria {
  return { type: "value", values };
}