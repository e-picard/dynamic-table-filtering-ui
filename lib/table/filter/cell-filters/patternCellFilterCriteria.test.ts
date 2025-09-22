import { assert, suite, test } from "vitest";
import { patternCellFilterCriteria } from "./patternCellFilterCriteria.js";
import { createCellFilterPredicate } from "./createCellFilterPredicate.js";

suite(patternCellFilterCriteria, () => {
  test("match anything any amount of times", () => {
    const predicate = createCellFilterPredicate(
      patternCellFilterCriteria(/.*/)
    );

    assert.isTrue(predicate(""));
    assert.isTrue(predicate("aoeuhtns&[{}*)+]"));
  });
  test("match anything one or more times", () => {
    const predicate = createCellFilterPredicate(
      patternCellFilterCriteria(/.+/)
    )

    assert.isFalse(predicate(""));
    assert.isTrue(predicate("abc"));
  });
});