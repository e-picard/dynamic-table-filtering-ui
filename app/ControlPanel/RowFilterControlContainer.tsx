import type { RowFilterCriteria } from "lib/table/filter/createRowFilterPredicate.js";
import type { PropsWithChildren } from "react";

export function RowFilterControlContainer({ children }: PropsWithChildren) {
  return <div>
    {children}
  </div>
}