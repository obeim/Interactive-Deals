"use client";

import React, { useState, useRef, useEffect } from "react";
import { Deal, ColumnConfig, DealStatus, Priority } from "@/lib/types";
import { useTableState } from "@/hooks/useTableState";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/data";
import ColumnManager from "./ColumnManager";
import FilterPanel from "./FilterPanel";

interface DealsTableProps {
  data: Deal[];
  columns: ColumnConfig[];
}

const DealsTable: React.FC<DealsTableProps> = ({ data, columns }) => {
  const {
    data: processedData,
    sortConfigs,
    filters,
    selectedRows,
    expandedRows,
    columns: tableColumns,
    toggleSort,
    updateFilters,
    toggleRowSelection,
    selectAllRows,
    toggleRowExpansion,
    updateColumns,
    clearFilters,
    setSort,
  } = useTableState(data, columns);

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    type: "column" | "row";
    target: string;
  } | null>(null);

  const [editingCell, setEditingCell] = useState<{
    rowId: string;
    column: keyof Deal;
  } | null>(null);

  const [resizingColumn, setResizingColumn] = useState<{
    key: keyof Deal;
    startX: number;
    startWidth: number;
  } | null>(null);

  const [showColumnManager, setShowColumnManager] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const tableRef = useRef<HTMLDivElement>(null);
  const [focusedCell, setFocusedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!focusedCell) return;

      const visibleColumns = tableColumns.filter((col) => col.visible);
      const maxRow = processedData.length - 1;
      const maxCol = visibleColumns.length - 1;

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          setFocusedCell((prev) =>
            prev ? { ...prev, row: Math.max(0, prev.row - 1) } : null
          );
          break;
        case "ArrowDown":
          e.preventDefault();
          setFocusedCell((prev) =>
            prev ? { ...prev, row: Math.min(maxRow, prev.row + 1) } : null
          );
          break;
        case "ArrowLeft":
          e.preventDefault();
          setFocusedCell((prev) =>
            prev ? { ...prev, col: Math.max(0, prev.col - 1) } : null
          );
          break;
        case "ArrowRight":
          e.preventDefault();
          setFocusedCell((prev) =>
            prev ? { ...prev, col: Math.min(maxCol, prev.col + 1) } : null
          );
          break;
        case "Enter":
          e.preventDefault();
          if (focusedCell) {
            const column = visibleColumns[focusedCell.col];
            const deal = processedData[focusedCell.row];
            setEditingCell({ rowId: deal.id, column: column.key });
          }
          break;
        case "Escape":
          e.preventDefault();
          setEditingCell(null);
          setFocusedCell(null);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [focusedCell, tableColumns, processedData]);

  // Handle column resizing
  const handleMouseDown = (e: React.MouseEvent, columnKey: keyof Deal) => {
    const column = tableColumns.find((col) => col.key === columnKey);
    if (!column) return;

    setResizingColumn({
      key: columnKey,
      startX: e.clientX,
      startWidth: column.width,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizingColumn) return;

      const diff = e.clientX - resizingColumn.startX;
      const newWidth = Math.max(80, resizingColumn.startWidth + diff);

      const updatedColumns = tableColumns.map((col) =>
        col.key === resizingColumn.key ? { ...col, width: newWidth } : col
      );
      updateColumns(updatedColumns);
    };

    const handleMouseUp = () => {
      setResizingColumn(null);
    };

    if (resizingColumn) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resizingColumn, tableColumns, updateColumns]);

  // Handle context menu
  const handleContextMenu = (
    e: React.MouseEvent,
    type: "column" | "row",
    target: string
  ) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      type,
      target,
    });
  };

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const renderCell = (
    deal: Deal,
    column: ColumnConfig,
    rowIndex: number,
    colIndex: number
  ) => {
    const isEditing =
      editingCell?.rowId === deal.id && editingCell?.column === column.key;
    const isFocused =
      focusedCell?.row === rowIndex && focusedCell?.col === colIndex;
    const value = deal[column.key];

    const cellClasses = `px-4 py-3 border-r border-gray-200 relative cursor-pointer transition-colors hover:bg-gray-50 text-gray-900 ${
      isFocused ? "ring-2 ring-blue-500 ring-inset" : ""
    } ${
      column.type === "number" ||
      column.type === "currency" ||
      column.type === "percentage"
        ? "text-right"
        : ""
    }`;

    const handleCellClick = () => {
      setFocusedCell({ row: rowIndex, col: colIndex });
      if (column.type === "status") {
        setEditingCell({ rowId: deal.id, column: column.key });
      }
    };

    const handleCellDoubleClick = () => {
      if (column.type !== "status") {
        setEditingCell({ rowId: deal.id, column: column.key });
      }
    };

    if (isEditing) {
      return (
        <td key={column.key} className={cellClasses}>
          {column.type === "status" ? (
            <StatusDropdown
              value={value as DealStatus | Priority}
              options={
                column.key === "status"
                  ? [
                      "New",
                      "Qualified",
                      "Proposal",
                      "Negotiation",
                      "Won",
                      "Lost",
                    ]
                  : ["Low", "Medium", "High", "Critical"]
              }
              onChange={(newValue) => {
                // In a real app, this would update the data
                console.log(
                  `Update ${column.key} to ${newValue} for deal ${deal.id}`
                );
                setEditingCell(null);
              }}
              onCancel={() => setEditingCell(null)}
            />
          ) : (
            <input
              type={
                column.type === "number" || column.type === "currency"
                  ? "number"
                  : "text"
              }
              defaultValue={String(value)}
              className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
              onBlur={() => setEditingCell(null)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setEditingCell(null);
                } else if (e.key === "Escape") {
                  setEditingCell(null);
                }
              }}
            />
          )}
        </td>
      );
    }

    return (
      <td
        key={column.key}
        className={cellClasses}
        onClick={handleCellClick}
        onDoubleClick={handleCellDoubleClick}
        tabIndex={0}
      >
        {column.type === "currency" ? (
          <span title={formatCurrency(value as number)}>
            {formatCurrency(value as number)}
          </span>
        ) : column.type === "percentage" ? (
          <span title={`${value}%`}>{`${value}%`}</span>
        ) : column.type === "date" ? (
          <span title={formatDate(value as string)}>
            {formatDate(value as string)}
          </span>
        ) : column.type === "status" ? (
          <StatusChip value={String(value)} />
        ) : (
          <span title={String(value)}>{String(value)}</span>
        )}
      </td>
    );
  };

  const visibleColumns = tableColumns.filter((col) => col.visible);
  const allSelected =
    selectedRows.size === processedData.length && processedData.length > 0;
  const someSelected =
    selectedRows.size > 0 && selectedRows.size < processedData.length;

  return (
    <div className="w-full h-full flex flex-col bg-white text-gray-900">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-100">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-gray-900">Deals</h1>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search deals..."
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 placeholder:text-gray-700 bg-white"
              value={filters.search || ""}
              onChange={(e) => updateFilters({ search: e.target.value })}
            />
            <button
              onClick={() => setShowFilterPanel(true)}
              className="px-3 py-2 text-sm text-gray-800 hover:text-gray-900 border border-gray-300 rounded-md flex items-center gap-2 bg-white hover:bg-gray-100"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filters
            </button>
            <button
              onClick={() => setShowColumnManager(true)}
              className="px-3 py-2 text-sm text-gray-800 hover:text-gray-900 border border-gray-300 rounded-md flex items-center gap-2 bg-white hover:bg-gray-100"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2z"
                />
              </svg>
              Columns
            </button>
            {Object.keys(filters).length > 0 && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-sm text-gray-800 hover:text-gray-900 border border-gray-300 rounded-md bg-white hover:bg-gray-100"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {selectedRows.size > 0 && (
          <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-md">
            <span className="text-sm text-blue-700">
              {selectedRows.size} selected
            </span>
            <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
              Bulk Actions
            </button>
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-auto" ref={tableRef}>
        <table className="min-w-full table-fixed" role="grid" aria-label="Deals table">
          <thead className="sticky top-0 bg-white z-10" role="rowgroup">
            <tr className="border-b border-gray-200">
              {[
                <th key="select" className="w-12 px-4 py-3 text-left" scope="col">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected;
                    }}
                    onChange={(e) => selectAllRows(e.target.checked)}
                    aria-label="Select all rows"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>,
                <th key="expand" className="w-8 px-2 py-3" scope="col">
                  <span className="sr-only">Expand</span>
                </th>,
                ...visibleColumns.map((column) => (
                  <th
                    key={column.key}
                    className="px-4 py-3 text-left border-r border-gray-200 bg-gray-50 relative group"
                    style={{ width: column.width }}
                    onContextMenu={(e) =>
                      handleContextMenu(e, "column", String(column.key))
                    }
                    scope="col"
                    aria-sort={
                      sortConfigs.find((config) => config.key === column.key)
                        ? (sortConfigs.find((config) => config.key === column.key)!
                            .direction === "asc"
                            ? "ascending"
                            : "descending")
                        : "none"
                    }
                  >
                    <div className="flex items-center justify-between">
                      <button
                        className="flex items-center gap-2 font-medium text-gray-900 hover:text-blue-700"
                        onClick={(e) => toggleSort(column.key, e.shiftKey)}
                        title="Click to sort. Shift+Click to multi-sort"
                        aria-label={`${column.label} column, click to sort`}
                      >
                        {column.label}
                        {sortConfigs.find(
                          (config) => config.key === column.key
                        ) && (
                          <span className="text-blue-700">
                            {sortConfigs.find(
                              (config) => config.key === column.key
                            )?.direction === "asc"
                              ? "↑"
                              : "↓"}
                          </span>
                        )}
                      </button>
                      <div
                        className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-200 opacity-0 group-hover:opacity-100"
                        onMouseDown={(e) => handleMouseDown(e, column.key)}
                        role="separator"
                        aria-label={`Resize column ${column.label}`}
                      />
                    </div>
                  </th>
                )),
              ]}
            </tr>
          </thead>
          <tbody role="rowgroup">
            {processedData.length === 0 && (
              <tr>
                <td
                  colSpan={visibleColumns.length + 2}
                  className="px-4 py-8 text-center text-gray-600"
                >
                  No results. Try adjusting filters.
                </td>
              </tr>
            )}
            {processedData.map((deal, rowIndex) => {
              const rowCells = [
                <td key="select" className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(deal.id)}
                    readOnly
                    onClick={(e) =>
                      toggleRowSelection(
                        deal.id,
                        e.shiftKey || e.ctrlKey || e.metaKey
                      )
                    }
                    aria-label={`Select row for ${deal.dealName}`}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>,
                <td key="expand" className="px-2 py-3">
                  <button
                    onClick={() => toggleRowExpansion(deal.id)}
                    className="p-1 hover:bg-gray-200 rounded"
                    aria-label={
                      expandedRows.has(deal.id)
                        ? `Collapse details for ${deal.dealName}`
                        : `Expand details for ${deal.dealName}`
                    }
                  >
                    {expandedRows.has(deal.id) ? "▼" : "▶"}
                  </button>
                </td>,
                ...visibleColumns.map((column, colIndex) =>
                  React.cloneElement(
                    renderCell(
                      deal,
                      column,
                      rowIndex,
                      colIndex
                    ) as unknown as React.ReactElement,
                    { key: String(column.key) }
                  )
                ),
              ];
              return (
                <React.Fragment key={deal.id}>
                  <tr
                    className={`border-b border-gray-100 hover:bg-gray-100 ${
                      selectedRows.has(deal.id)
                        ? "bg-blue-50 text-gray-900"
                        : ""
                    }`}
                    onContextMenu={(e) => handleContextMenu(e, "row", deal.id)}
                  >
                    {rowCells}
                  </tr>
                  {expandedRows.has(deal.id) && (
                    <tr>
                      <td
                        colSpan={visibleColumns.length + 2}
                        className="px-4 py-4 bg-gray-50"
                      >
                        <ExpandedRowContent deal={deal} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Totals Bar */}
      <div className="border-t border-gray-200 bg-gray-100 px-4 py-3">
        <div className="flex items-center justify-between text-sm text-gray-800">
          <span title="Number of deals">{processedData.length} deals</span>
          <div className="flex gap-6">
            <span title="Sum of Amount column">
              Total Value: {" "}
              {formatCurrency(
                processedData.reduce((sum, deal) => sum + deal.amount, 0)
              )}
            </span>
            <span title="Average of Probability column">
              Avg Probability: {" "}
              {processedData.length > 0
                ? Math.round(
                    processedData.reduce(
                      (sum, deal) => sum + deal.probability,
                      0
                    ) / processedData.length
                  )
                : 0}
              %
            </span>
          </div>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          type={contextMenu.type}
          target={contextMenu.target}
          onClose={() => setContextMenu(null)}
          columns={tableColumns}
          onUpdateColumns={updateColumns}
          onSort={(key, direction, additive) =>
            setSort(key, direction, additive)
          }
        />
      )}

      {/* Column Manager Modal */}
      {showColumnManager && (
        <ColumnManager
          columns={tableColumns}
          onUpdateColumns={updateColumns}
          onClose={() => setShowColumnManager(false)}
        />
      )}

      {/* Filter Panel */}
      <FilterPanel
        filters={filters}
        onUpdateFilters={updateFilters}
        data={data}
        isOpen={showFilterPanel}
        onClose={() => setShowFilterPanel(false)}
      />
    </div>
  );
};

// Status Chip Component
const StatusChip: React.FC<{ value: string }> = ({ value }) => (
  <span
    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
      value
    )}`}
    title={value}
  >
    {value}
  </span>
);

// Status Dropdown Component
const StatusDropdown: React.FC<{
  value: string;
  options: string[];
  onChange: (value: string) => void;
  onCancel: () => void;
}> = ({ value, options, onChange, onCancel }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onCancel}
      autoFocus
      className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

// Expanded Row Content Component
const ExpandedRowContent: React.FC<{ deal: Deal }> = ({ deal }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <h4 className="font-medium text-gray-900 mb-2">Deal Details</h4>
      <div className="space-y-2 text-sm">
        <div>
          <span className="font-medium">Tags:</span> {deal.tags.join(", ")}
        </div>
        <div>
          <span className="font-medium">Source:</span> {deal.source}
        </div>
        <div>
          <span className="font-medium">Notes:</span> {deal.notes}
        </div>
      </div>
    </div>
    <div>
      <h4 className="font-medium text-gray-900 mb-2">Recent Activities</h4>
      <div className="space-y-2">
        {deal.activities.slice(0, 3).map((activity) => (
          <div key={activity.id} className="flex items-start gap-2 text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <div className="font-medium">{activity.description}</div>
              <div className="text-gray-500">
                {formatDate(activity.date)} by {activity.user}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Context Menu Component
const ContextMenu: React.FC<{
  x: number;
  y: number;
  type: "column" | "row";
  target: string;
  onClose: () => void;
  columns: ColumnConfig[];
  onUpdateColumns: (columns: ColumnConfig[]) => void;
  onSort: (
    key: keyof Deal,
    direction: "asc" | "desc",
    additive?: boolean
  ) => void;
}> = ({ x, y, type, target, onClose, columns, onUpdateColumns, onSort }) => {
  const menuRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    // focus first actionable element when menu opens
    const firstButton = menuRef.current?.querySelector<HTMLButtonElement>(
      'button'
    );
    firstButton?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleHideColumn = () => {
    if (type === "column") {
      const updatedColumns = columns.map((col) =>
        col.key === target ? { ...col, visible: false } : col
      );
      onUpdateColumns(updatedColumns);
    }
    onClose();
  };

  return (
    <div
      className="fixed bg-white border border-gray-200 rounded-md shadow-lg py-2 z-50"
      style={{ left: x, top: y }}
      role="menu"
      aria-label={type === 'column' ? 'Column menu' : 'Row menu'}
      ref={menuRef}
      tabIndex={-1}
    >
      {type === "column" ? (
        <>
          <button
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
            onClick={handleHideColumn}
            role="menuitem"
          >
            Hide Column
          </button>
          <button
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
            onClick={() => {
              onSort(target as keyof Deal, "asc");
              onClose();
            }}
            role="menuitem"
          >
            Sort Ascending
          </button>
          <button
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
            onClick={() => {
              onSort(target as keyof Deal, "desc");
              onClose();
            }}
            role="menuitem"
          >
            Sort Descending
          </button>
        </>
      ) : (
        <>
          <button
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
            onClick={onClose}
            role="menuitem"
          >
            Edit Row
          </button>
          <button
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
            onClick={onClose}
            role="menuitem"
          >
            Duplicate Row
          </button>
          <button
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-red-600"
            onClick={onClose}
            role="menuitem"
          >
            Delete Row
          </button>
        </>
      )}
    </div>
  );
};

export default DealsTable;
