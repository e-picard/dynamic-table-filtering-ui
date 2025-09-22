import { createCellFilterPredicate } from "./createCellFilterPredicate.js";
import { rangeCellFilterCriteria } from "./rangeCellFilterCriteria.js";
import { assert, suite, test } from "vitest";

suite(rangeCellFilterCriteria, () => {
  test("returns false given an invalid number", () => {
    const predicate = createCellFilterPredicate(
      rangeCellFilterCriteria({ minInclusive: -1 })
    );

    assert.isFalse(predicate("xyz"));
    assert.isFalse(predicate("abc"));
  })
  test("minInclusive only", () => {
    const predicate = createCellFilterPredicate(
      rangeCellFilterCriteria({ minInclusive: -1 })
    );

    assert.isFalse(predicate("-1.1"));
    assert.isTrue(predicate("-1"));
    assert.isTrue(predicate("-0.9"));
  });
  test("maxInclusive only", () => {
    const predicate = createCellFilterPredicate(
      rangeCellFilterCriteria({ maxInclusive: -1 })
    );

    assert.isTrue(predicate("-1.1"));
    assert.isTrue(predicate("-1"));
    assert.isFalse(predicate("-0.9"));
  });
  test("both", () => {
    const predicate = createCellFilterPredicate(
      rangeCellFilterCriteria({
        minInclusive: -1,
        maxInclusive: 1
      })
    );

    assert.isFalse(predicate("-1.1"));
    assert.isTrue(predicate("-1"));
    assert.isTrue(predicate("-0.9"));
    assert.isTrue(predicate("0.9"));
    assert.isTrue(predicate("1"));
    assert.isFalse(predicate("1.1"));
  })
});