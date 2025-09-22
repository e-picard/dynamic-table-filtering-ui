/**
 * Maps one object to another, preserving type information
 */
export function objectOfObject<
  T extends { [Key in TK]: TV },
  TK extends keyof T,
  TV extends T[TK],
  UK extends string | symbol | number = TK,
  UV extends any = TV
>(source: T, mapper: (key: TK, value: TV) => [UK, UV]) {
    return Object.fromEntries(
      Object.entries(source)
        .map(([key, value]) => mapper(key as TK, value as TV))
    ) as { [Key in UK]: UV };
}