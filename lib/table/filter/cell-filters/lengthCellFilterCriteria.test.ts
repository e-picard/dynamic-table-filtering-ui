import { assert, suite, test } from "vitest";
import { lengthCellFilterCriteria } from "./lengthCellFilterCriteria.js";
import { createCellFilterPredicate } from "./createCellFilterPredicate.js";

suite(lengthCellFilterCriteria, () => {
  test("minLength only", () => {
    const predicate = createCellFilterPredicate(
      lengthCellFilterCriteria({ minLength: 2 })
    );

    assert.isFalse(predicate(""));
    assert.isFalse(predicate("a"));
    assert.isTrue(predicate("ab"));
    assert.isTrue(predicate("abc"));
  });
  test("maxLength only", () => {
    const predicate = createCellFilterPredicate(
      lengthCellFilterCriteria({ maxLength: 2 })
    );

    assert.isTrue(predicate(""));
    assert.isTrue(predicate("a"));
    assert.isTrue(predicate("ab"));
    assert.isFalse(predicate("abc"));
  });
  test("minLength and maxLength", () => {
    const predicate = createCellFilterPredicate(
      lengthCellFilterCriteria({ minLength: 1, maxLength: 2 })
    );

    assert.isFalse(predicate(""));
    assert.isTrue(predicate("a"));
    assert.isTrue(predicate("ab"));
    assert.isFalse(predicate("abc"));
  });
});