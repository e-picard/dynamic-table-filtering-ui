export type PatternCellFilterCriteria = {
  type: "pattern",
  pattern: RegExp
}

export function patternCellFilterCriteria(pattern: RegExp): PatternCellFilterCriteria {
  return {
    type: "pattern",
    pattern
  }
}