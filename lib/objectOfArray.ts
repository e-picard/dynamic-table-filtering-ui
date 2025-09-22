/**
 * Maps an array to an object, preserving type information
 */
export function objectOfArray<
  T extends Array<any>,
  UK extends string | symbol | number,
  UV extends any
>(source: T, mapper: (value: T[number]) => [UK, UV]) {
  return Object.fromEntries(source.map(mapper)) as { [Key in UK]: UV };
}