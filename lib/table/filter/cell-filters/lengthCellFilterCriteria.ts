export type LengthCellFilterCriteria = {
  type: "length",
  minLength: number,
  maxLength: number
}

export function lengthCellFilterCriteria(
  { minLength, maxLength }: Partial<Omit<LengthCellFilterCriteria, "type">>
): LengthCellFilterCriteria
{
  return {
    type: "length",
    minLength: minLength ?? 0,
    maxLength: maxLength ?? Infinity
  };
};
