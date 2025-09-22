import { assert, suite, test } from "vitest";
import { createColumnFilterPredicate } from "./createColumnFilterPredicate.js";
import { valueCellFilterCriteria } from "./cell-filters/valueCellFilterCriteria.js";
import { rangeCellFilterCriteria } from "./cell-filters/rangeCellFilterCriteria.js";
import { patternCellFilterCriteria } from "./cell-filters/patternCellFilterCriteria.js";

suite(createColumnFilterPredicate, () => {
  suite("for_every", () => {
    test("no cell filter criterias are provided", () => {
      const predicate = createColumnFilterPredicate({
        quantification: "for_every",
        cellCriterias: []
      });
      
      assert.isTrue(predicate(""));
      assert.isTrue(predicate("123"));
      assert.isTrue(predicate("abc"));
    }),
    test("one cell filter criteria is satisfied", () => {
      const predicate = createColumnFilterPredicate({
        quantification: "for_every",
        cellCriterias: [
          valueCellFilterCriteria(new Set(["abc"]))
        ]
      });

      assert.isFalse(predicate(""));
      assert.isFalse(predicate("123"));
      assert.isTrue(predicate("abc"));
    }),
    test("every cell filter criteria is satisfied", () => {
      // Cell must hold a value between 2 and 6 AND have one decimal place
      const predicate = createColumnFilterPredicate({
        quantification: "for_every",
        cellCriterias: [
          rangeCellFilterCriteria({ minInclusive: 2, maxInclusive: 6 }),
          patternCellFilterCriteria(/\d+\.\d/)
        ]
      });

      assert.isFalse(predicate("1"));
      assert.isFalse(predicate("1.0"));

      assert.isFalse(predicate("4"));
      assert.isTrue(predicate("4.0"));

      assert.isFalse(predicate("7"));
      assert.isFalse(predicate("7.0"));

    })
  });
  suite("for_every", () => {
    test("no cell filter criteria are provided", () => {
      const predicate = createColumnFilterPredicate({
        quantification: "for_every",
        cellCriterias: []
      });
      
      assert.isTrue(predicate(""));
      assert.isTrue(predicate("123"));
      assert.isTrue(predicate("abc"));
    });
    test("any cell filter criteria is satisfied", () => {
      // Cell must hold a value between 2 and 6 OR have one decimal place
      const predicate = createColumnFilterPredicate({
        quantification: "for_any",
        cellCriterias: [
          rangeCellFilterCriteria({ minInclusive: 2, maxInclusive: 6 }),
          patternCellFilterCriteria(/\d+\.\d/)
        ]
      });

      assert.isFalse(predicate("1"));
      assert.isTrue(predicate("1.0"));

      assert.isTrue(predicate("4"));
      assert.isTrue(predicate("4.0"));

      assert.isFalse(predicate("7"));
      assert.isTrue(predicate("7.0"));
    });
  })
});