import { assert, suite, test } from "vitest";
import { valueCellFilterCriteria } from "./valueCellFilterCriteria.js";
import { createCellFilterPredicate } from "./createCellFilterPredicate.js";

suite(valueCellFilterCriteria, () => {
  test("empty set", () => {
    const predicate = createCellFilterPredicate(
      valueCellFilterCriteria(new Set([]))
    );

    assert.isFalse(predicate(""));
  });
  test("one element", () => {
    const predicate = createCellFilterPredicate(
      valueCellFilterCriteria(new Set(["abc"]))
    );

    assert.isFalse(predicate("ab_"));
    assert.isFalse(predicate("a_c"));
    assert.isTrue(predicate("abc"));
  });
  test("two elements", () => {
    const predicate = createCellFilterPredicate(
      valueCellFilterCriteria(new Set(["a", "b"]))
    );

    assert.isTrue(predicate("a"));
    assert.isTrue(predicate("b"));
    assert.isFalse(predicate("c"));
  });
});