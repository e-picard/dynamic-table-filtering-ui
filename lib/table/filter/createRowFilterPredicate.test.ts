import { assert, suite, test } from "vitest";
import { createRowFilterPredicate } from "./createRowFilterPredicate.js";
import type { Table } from "lib/Table.js";
import { rangeCellFilterCriteria } from "./cell-filters/rangeCellFilterCriteria.js";
import { nullRowFilterCriteria } from "./nullRowFilterCriteria.js";
import { patternCellFilterCriteria } from "./cell-filters/patternCellFilterCriteria.js";

suite(createRowFilterPredicate, () => {
  suite("for_every", () => {
    test("no column filter criterias are provided", () => {
      const predicate = createRowFilterPredicate({
        primaryKey: "id",
        columnNames: ["id"],
        rows: []
      },
      nullRowFilterCriteria()
    );

    assert.isTrue(predicate({ id: "test" }));
    assert.isTrue(predicate({ id: "everything will pass" }));
    });
    test("one column filter criteria", () => {
      // Find rows where (x >= 17 AND x is 2 digits)
      const predicate = createRowFilterPredicate({
        primaryKey: "x",
        columnNames: ["x"],
        rows: []
      }, {
        quantification: "for_every",
        columnCriterias: {
          x: {
            quantification: "for_every",
            cellCriterias: [
              rangeCellFilterCriteria({ minInclusive: 17 }),
              patternCellFilterCriteria(/^\d\d$/)
            ]
          }
        }
      })

      assert.isFalse(predicate({ x: "16" }));
      assert.isFalse(predicate({ x: "16.5" }));
      assert.isTrue(predicate({ x: "17" }));
      assert.isFalse(predicate({ x: "17.5" }));
      assert.isTrue(predicate({ x: "18" }));
    })
    test("many column filter criterias", () => {
      // Find rows where (x >= 17 AND x is 2 digits) AND (word contains "abc")
      const predicate = createRowFilterPredicate({
        primaryKey: "x",
        columnNames: ["x", "word"],
        rows: []
      }, {
        quantification: "for_every",
        columnCriterias: {
          x: {
            quantification: "for_every",
            cellCriterias: [
              rangeCellFilterCriteria({ minInclusive: 17 }),
              patternCellFilterCriteria(/^\d\d$/)
            ]
          },
          word: {
            quantification: "for_every",
            cellCriterias: [
              patternCellFilterCriteria(/abc/)
            ]
          }
        }
      });

      assert.isFalse(predicate({ x: "16", word: "abcdefg" }));
      assert.isTrue(predicate({ x: "18", word: "abcdefg" }));
      assert.isFalse(predicate({ x: "18.0", word: "abcdefg" }));
      assert.isFalse(predicate({ x: "18", word: "xyz123" }));
    });
  });
  suite("for_any", () => {
    test("no column filter criterias", () => {
      const predicate = createRowFilterPredicate({
        primaryKey: "id",
        columnNames: ["id"],
        rows: []
      },
      nullRowFilterCriteria()
    );

    assert.isTrue(predicate({ id: "test" }));
    assert.isTrue(predicate({ id: "everything will pass" }));
    });
    test("one column filter criteria", () => {
      // Find rows where (x >= 17 AND x is 2 digits)
      const predicate = createRowFilterPredicate({
        primaryKey: "x",
        columnNames: ["x"],
        rows: []
      }, {
        quantification: "for_any",
        columnCriterias: {
          x: {
            quantification: "for_every",
            cellCriterias: [
              rangeCellFilterCriteria({ minInclusive: 17 }),
              patternCellFilterCriteria(/^\d\d$/)
            ]
          }
        }
      })

      assert.isFalse(predicate({ x: "16" }));
      assert.isFalse(predicate({ x: "16.5" }));
      assert.isTrue(predicate({ x: "17" }));
      assert.isFalse(predicate({ x: "17.5" }));
      assert.isTrue(predicate({ x: "18" }));
    })
    test("many filter criterias", () => {
      // Find rows where (x >= 17 AND x is 2 digits) OR (word contains "abc")
      const predicate = createRowFilterPredicate({
        primaryKey: "x",
        columnNames: ["x", "word"],
        rows: []
      }, {
        quantification: "for_any",
        columnCriterias: {
          x: {
            quantification: "for_every",
            cellCriterias: [
              rangeCellFilterCriteria({ minInclusive: 17 }),
              patternCellFilterCriteria(/^\d\d$/)
            ]
          },
          word: {
            quantification: "for_every",
            cellCriterias: [
              patternCellFilterCriteria(/abc/)
            ]
          }
        }
      });

      assert.isTrue(predicate({ x: "16", word: "abcdefg" }));
      assert.isTrue(predicate({ x: "18", word: "abcdefg" }));
      assert.isTrue(predicate({ x: "18.0", word: "abcdefg" }));
      assert.isTrue(predicate({ x: "18", word: "xyz123" }));
      assert.isFalse(predicate({ x: "16", word: "xyz123" }));
    });
  });
});