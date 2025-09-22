import { useState, useMemo } from "react";
import type { Table } from "lib/Table.js";
import { filterTable } from "lib/table/filter/filterTable.js";
import { patternCellFilterCriteria } from "lib/table/filter/cell-filters/patternCellFilterCriteria.js";
import { valueCellFilterCriteria } from "lib/table/filter/cell-filters/valueCellFilterCriteria.js";
import { rangeCellFilterCriteria } from "lib/table/filter/cell-filters/rangeCellFilterCriteria.js";
import { lengthCellFilterCriteria } from "lib/table/filter/cell-filters/lengthCellFilterCriteria.js";
import type { ColumnFilterCriteria } from "lib/table/filter/createColumnFilterPredicate.js";
import type { RowFilterCriteria } from "lib/table/filter/createRowFilterPredicate.js";
import type { CellFilterCriteria } from "lib/table/filter/cell-filters/createCellFilterPredicate.js";
import { MultiTableViewer } from "./MultiTableViewer.js";

export type ControlPanelProps<TableName extends string> = {
  tables: {
    [Key in TableName]: Table<string, string>
  }
}

export function ControlPanel<
  TableName extends string
>({
  tables
}: ControlPanelProps<TableName>
)
{
  const tableNames = Object.keys(tables) as TableName[];

  const [selectedTables, setSelectedTables] = useState<Set<TableName>>(
    new Set(tableNames)
  );
  const [globalSearch, setGlobalSearch] = useState("");
  const [additionalFilters, setAdditionalFilters] = useState<Record<string, RowFilterCriteria<string>>>({});
  const [filterQuantification, setFilterQuantification] = useState<"for_any" | "for_every">("for_any");

  const analyzeColumn = (table: Table<string, string>, columnName: string) => {
    const values = table.rows.map(row => row[columnName]).filter(v => v && v.trim());
    const isNumeric = values.length > 0 && values.every(v => !isNaN(Number(v)) && v.trim() !== "");

    return {
      isNumeric,
      minValue: isNumeric ? Math.min(...values.map(Number)) : 0,
      maxValue: isNumeric ? Math.max(...values.map(Number)) : 0,
      minLength: Math.min(...values.map(v => v.length)),
      maxLength: Math.max(...values.map(v => v.length))
    };
  };


  const toggleTable = (tableName: TableName) => {
    const newSelected = new Set(selectedTables);
    if (newSelected.has(tableName)) {
      newSelected.delete(tableName);
    } else {
      newSelected.add(tableName);
    }
    setSelectedTables(newSelected);
  };

  const filteredTables = useMemo(() => {
    // This must be Partial because we only include selected tables,
    // not all tables that exist in the original tables object
    const result: Partial<{ [Key in TableName]: Table<string, string> }> = {};

    for (const tableName of Array.from(selectedTables)) {
      let table = tables[tableName];

      if (globalSearch.trim()) {
        const searchPattern = new RegExp(globalSearch.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        const columnCriterias: { [K in typeof table.columnNames[number]]?: ColumnFilterCriteria } = {};

        for (const columnName of table.columnNames) {
          columnCriterias[columnName] = {
            quantification: "for_any" as const,
            cellCriterias: [patternCellFilterCriteria(searchPattern)]
          };
        }

        const searchCriteria: RowFilterCriteria<typeof table.columnNames[number]> = {
          quantification: "for_any" as const,
          columnCriterias
        };

        table = filterTable(table, searchCriteria);
      }

      Object.entries(additionalFilters).forEach(([filterKey, criteria]) => {
        if (filterKey.startsWith(`${tableName}-`)) {
          table = filterTable(table, criteria);
        }
      });

      result[tableName] = table;
    }

    return result;
  }, [tables, selectedTables, globalSearch, additionalFilters, filterQuantification]);

  return <div className="h-screen w-full bg-gray-50">
    <div className="h-full flex">
      <div className="w-72 bg-white border-r-2 border-gray-300 p-4 flex flex-col space-y-4">
        <div className="border-2 border-gray-300 rounded-lg p-3">
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="🔍 Search"
            className="w-full text-lg border-none outline-none bg-transparent"
          />
        </div>

        <div className="border-2 border-gray-300 rounded-lg p-3 flex-1">
          <h3 className="text-center font-medium mb-3 text-gray-700">Tables Being Searched</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {tableNames.map(tableName => (
              <label key={tableName} className="flex items-center space-x-2 cursor-pointer p-1 hover:bg-gray-50 rounded">
                <input
                  type="checkbox"
                  checked={selectedTables.has(tableName)}
                  onChange={() => toggleTable(tableName)}
                  className="rounded border-gray-400"
                />
                <span className="text-sm capitalize">{tableName}</span>
                <span className="text-xs text-gray-500 ml-auto">
                  ({tables[tableName].rows.length})
                </span>
              </label>
            ))}
          </div>

          <div className="mt-3 space-y-1">
            <button
              onClick={() => setSelectedTables(new Set(tableNames))}
              className="w-full text-xs py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Select All
            </button>
            <button
              onClick={() => setSelectedTables(new Set())}
              className="w-full text-xs py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="border-2 border-gray-300 rounded-lg p-3 flex-1 overflow-y-auto">
          <h3 className="text-center font-medium mb-3 text-gray-700">Advanced Filters</h3>

          <div className="mb-3">
            <label className="text-xs text-gray-600 block mb-1">Filter Logic</label>
            <select
              value={filterQuantification}
              onChange={(e) => setFilterQuantification(e.target.value as "for_any" | "for_every")}
              className="w-full text-xs px-2 py-1 border border-gray-300 rounded"
            >
              <option value="for_any">Match ANY condition (OR)</option>
              <option value="for_every">Match ALL conditions (AND)</option>
            </select>
          </div>

          {Array.from(selectedTables).map(tableName => {
            const table = tables[tableName];

            return (
              <div key={tableName} className="mb-4 border-b border-gray-200 pb-3">
                <div className="text-sm font-medium text-gray-700 mb-2 capitalize">{tableName}</div>

                {table.columnNames.slice(0, 3).map(columnName => {
                  const analysis = analyzeColumn(table, columnName);
                  const filterKey = `${tableName}-${columnName}`;

                  return (
                    <div key={columnName} className="mb-3 p-2 bg-gray-50 rounded">
                      <label className="text-xs font-medium text-gray-700 block mb-1">{columnName}</label>

                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Exact value match"
                          className="w-full text-xs px-2 py-1 border border-gray-300 rounded"
                          onChange={(e) => {
                            const value = e.target.value.trim();
                            const newFilters = { ...additionalFilters };
                            delete newFilters[`${filterKey}-value`];

                            if (value) {
                              newFilters[`${filterKey}-value`] = {
                                quantification: filterQuantification,
                                columnCriterias: {
                                  [columnName]: {
                                    quantification: "for_any",
                                    cellCriterias: [valueCellFilterCriteria(new Set([value]))]
                                  }
                                }
                              };
                            }
                            setAdditionalFilters(newFilters);
                          }}
                        />

                        <input
                          type="text"
                          placeholder="Pattern/regex match"
                          className="w-full text-xs px-2 py-1 border border-gray-300 rounded"
                          onChange={(e) => {
                            const value = e.target.value.trim();
                            const newFilters = { ...additionalFilters };
                            delete newFilters[`${filterKey}-pattern`];

                            if (value) {
                              try {
                                const regex = new RegExp(value, 'i');
                                newFilters[`${filterKey}-pattern`] = {
                                  quantification: filterQuantification,
                                  columnCriterias: {
                                    [columnName]: {
                                      quantification: "for_any",
                                      cellCriterias: [patternCellFilterCriteria(regex)]
                                    }
                                  }
                                };
                              } catch (e) {
                                const escapedValue = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                                const regex = new RegExp(escapedValue, 'i');
                                newFilters[`${filterKey}-pattern`] = {
                                  quantification: filterQuantification,
                                  columnCriterias: {
                                    [columnName]: {
                                      quantification: "for_any",
                                      cellCriterias: [patternCellFilterCriteria(regex)]
                                    }
                                  }
                                };
                              }
                            }
                            setAdditionalFilters(newFilters);
                          }}
                        />

                        {analysis.isNumeric && (
                          <div className="flex space-x-1">
                            <input
                              type="number"
                              placeholder={`Min (${analysis.minValue})`}
                              className="flex-1 text-xs px-2 py-1 border border-gray-300 rounded"
                              onChange={(e) => {
                                const min = e.target.value ? Number(e.target.value) : analysis.minValue;
                                const newFilters = { ...additionalFilters };
                                const existing = newFilters[`${filterKey}-range`];
                                const maxValue = existing ?
                                  (existing.columnCriterias[columnName]?.cellCriterias[0] as any)?.maxInclusive ?? analysis.maxValue :
                                  analysis.maxValue;

                                if (min !== analysis.minValue || maxValue !== analysis.maxValue) {
                                  newFilters[`${filterKey}-range`] = {
                                    quantification: filterQuantification,
                                    columnCriterias: {
                                      [columnName]: {
                                        quantification: "for_any",
                                        cellCriterias: [rangeCellFilterCriteria({ minInclusive: min, maxInclusive: maxValue })]
                                      }
                                    }
                                  };
                                } else {
                                  delete newFilters[`${filterKey}-range`];
                                }
                                setAdditionalFilters(newFilters);
                              }}
                            />
                            <input
                              type="number"
                              placeholder={`Max (${analysis.maxValue})`}
                              className="flex-1 text-xs px-2 py-1 border border-gray-300 rounded"
                              onChange={(e) => {
                                const max = e.target.value ? Number(e.target.value) : analysis.maxValue;
                                const newFilters = { ...additionalFilters };
                                const existing = newFilters[`${filterKey}-range`];
                                const minValue = existing ?
                                  (existing.columnCriterias[columnName]?.cellCriterias[0] as any)?.minInclusive ?? analysis.minValue :
                                  analysis.minValue;

                                if (minValue !== analysis.minValue || max !== analysis.maxValue) {
                                  newFilters[`${filterKey}-range`] = {
                                    quantification: filterQuantification,
                                    columnCriterias: {
                                      [columnName]: {
                                        quantification: "for_any",
                                        cellCriterias: [rangeCellFilterCriteria({ minInclusive: minValue, maxInclusive: max })]
                                      }
                                    }
                                  };
                                } else {
                                  delete newFilters[`${filterKey}-range`];
                                }
                                setAdditionalFilters(newFilters);
                              }}
                            />
                          </div>
                        )}

                        <div className="flex space-x-1">
                          <input
                            type="number"
                            placeholder={`Min length (${analysis.minLength})`}
                            className="flex-1 text-xs px-2 py-1 border border-gray-300 rounded"
                            onChange={(e) => {
                              const minLen = e.target.value ? Number(e.target.value) : analysis.minLength;
                              const newFilters = { ...additionalFilters };
                              const existing = newFilters[`${filterKey}-length`];
                              const maxLen = existing ?
                                (existing.columnCriterias[columnName]?.cellCriterias[0] as any)?.maxLength ?? analysis.maxLength :
                                analysis.maxLength;

                              if (minLen !== analysis.minLength || maxLen !== analysis.maxLength) {
                                newFilters[`${filterKey}-length`] = {
                                  quantification: filterQuantification,
                                  columnCriterias: {
                                    [columnName]: {
                                      quantification: "for_any",
                                      cellCriterias: [lengthCellFilterCriteria({ minLength: minLen, maxLength: maxLen })]
                                    }
                                  }
                                };
                              } else {
                                delete newFilters[`${filterKey}-length`];
                              }
                              setAdditionalFilters(newFilters);
                            }}
                          />
                          <input
                            type="number"
                            placeholder={`Max length (${analysis.maxLength})`}
                            className="flex-1 text-xs px-2 py-1 border border-gray-300 rounded"
                            onChange={(e) => {
                              const maxLen = e.target.value ? Number(e.target.value) : analysis.maxLength;
                              const newFilters = { ...additionalFilters };
                              const existing = newFilters[`${filterKey}-length`];
                              const minLen = existing ?
                                (existing.columnCriterias[columnName]?.cellCriterias[0] as any)?.minLength ?? analysis.minLength :
                                analysis.minLength;

                              if (minLen !== analysis.minLength || maxLen !== analysis.maxLength) {
                                newFilters[`${filterKey}-length`] = {
                                  quantification: filterQuantification,
                                  columnCriterias: {
                                    [columnName]: {
                                      quantification: "for_any",
                                      cellCriterias: [lengthCellFilterCriteria({ minLength: minLen, maxLength: maxLen })]
                                    }
                                  }
                                };
                              } else {
                                delete newFilters[`${filterKey}-length`];
                              }
                              setAdditionalFilters(newFilters);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}

          <button
            onClick={() => {
              setGlobalSearch("");
              setAdditionalFilters({});
            }}
            className="w-full text-sm py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Clear All Filters
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white">
        <MultiTableViewer tables={filteredTables} />
      </div>
    </div>
  </div>
}