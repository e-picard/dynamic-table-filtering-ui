import { suite, test, assert } from "vitest";
import { filterTable } from "./filterTable.js";
import { nullRowFilterCriteria } from "./nullRowFilterCriteria.js";
import { rangeCellFilterCriteria } from "./cell-filters/rangeCellFilterCriteria.js";
import type { Table } from "lib/Table.js";
import { patternCellFilterCriteria } from "./cell-filters/patternCellFilterCriteria.js";
import { lengthCellFilterCriteria } from "./cell-filters/lengthCellFilterCriteria.js";

const table: Table<"id" | "name" | "dollars", "id"> = {
  primaryKey: "id",
  columnNames: ["id", "name", "dollars"] as const,
  rows: [
    {
      id: "1",
      name: "Pizza",
      dollars: "20"
    },
    {
      id: "2",
      name: "Sub",
      dollars: "17"
    },
    {
      id: "3",
      name: "Chili",
      dollars: "15"
    },
    {
      id: "4",
      name: "Apple",
      dollars: "1"
    }
  ],
} as const;

suite(filterTable, () => {
  test("null criteria", () => {
    const filteredTable = filterTable(
      table,
      nullRowFilterCriteria()
    );

    assert.deepEqual(table, filteredTable);
  });
  suite("for_every", () => {
    test("single criteria", () => {
      const cheapFood = filterTable(
        table,
        {
          quantification: "for_every",
          columnCriterias: {
            dollars: {
              quantification: "for_every",
              cellCriterias: [
                rangeCellFilterCriteria({
                  maxInclusive: 15
                })
              ]
            }
          }
        }
      );

      assert.deepEqual([
        {
          id: "3",
          name: "Chili",
          dollars: "15"
        },
        {
          id: "4",
          name: "Apple",
          dollars: "1"
        }
      ], cheapFood.rows)
    });
    test("many criterias", () => {
      const filteredFood = filterTable(
        table,
        {
          // Any row where (word contains "i" OR is exactly 3 letters long) AND (1 <= id <= 3)
          quantification: "for_every",
          columnCriterias: {
            id: {
              quantification: "for_every",
              cellCriterias: [
                rangeCellFilterCriteria({ minInclusive: 1, maxInclusive: 3 })
              ]
            },
            name: {
              // Contains an "i" OR is exactly 3 letters long
              quantification: "for_any",
              cellCriterias: [
                patternCellFilterCriteria(/i/),
                lengthCellFilterCriteria({ minLength: 3, maxLength: 3 })
              ]
            }
          }
        }
      );

      assert.deepEqual([
        {
          id: "1",
          name: "Pizza",
          dollars: "20"
        },
        {
          id: "2",
          name: "Sub",
          dollars: "17"
        },
        {
          id: "3",
          name: "Chili",
          dollars: "15"
        }
      ], filteredFood.rows);
    });
  });
  suite("for_any", () => {
    test("single criteria", () => {
      const cheapFood = filterTable(
        table,
        {
          quantification: "for_any",
          columnCriterias: {
            dollars: {
              quantification: "for_every",
              cellCriterias: [
                rangeCellFilterCriteria({
                  maxInclusive: 15
                })
              ]
            }
          }
        }
      );

      assert.deepEqual([
        {
          id: "3",
          name: "Chili",
          dollars: "15"
        },
        {
          id: "4",
          name: "Apple",
          dollars: "1"
        }
      ], cheapFood.rows)
    });
    test("many criterias", () => {
      const filteredFood = filterTable(
        table,
        {
          // Any row where (word contains "i" OR is exactly 3 letters long) OR (3 <= id <= 4)
          quantification: "for_any",
          columnCriterias: {
            id: {
              quantification: "for_every",
              cellCriterias: [
                rangeCellFilterCriteria({ minInclusive: 3, maxInclusive: 4 })
              ]
            },
            name: {
              // Contains an "i" OR is exactly 3 letters long
              quantification: "for_any",
              cellCriterias: [
                patternCellFilterCriteria(/i/),
                lengthCellFilterCriteria({ minLength: 3, maxLength: 3 })
              ]
            }
          }
        }
      );

      assert.deepEqual([
        {
          id: "1",
          name: "Pizza",
          dollars: "20"
        },
        {
          id: "2",
          name: "Sub",
          dollars: "17"
        },
        {
          id: "3",
          name: "Chili",
          dollars: "15"
        },
        {
          id: "4",
          name: "Apple",
          dollars: "1"
        }
      ], filteredFood.rows);
    });
  });
})