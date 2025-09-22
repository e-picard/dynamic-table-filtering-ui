export type RangeCellFilterCriteria = {
  type: "range",
  minInclusive: number,
  maxInclusive: number,
}

export function rangeCellFilterCriteria(
  { minInclusive = -Infinity, maxInclusive = Infinity }: Partial<Omit<RangeCellFilterCriteria, "type">>
): RangeCellFilterCriteria
{
  return {
    type: "range",
    minInclusive,
    maxInclusive
  }
}