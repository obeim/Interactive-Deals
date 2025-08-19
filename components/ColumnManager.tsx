"use client";

import React, { useState } from "react";
import { ColumnConfig } from "@/lib/types";

interface ColumnManagerProps {
  columns: ColumnConfig[];
  onUpdateColumns: (columns: ColumnConfig[]) => void;
  onClose: () => void;
}

const ColumnManager: React.FC<ColumnManagerProps> = ({
  columns,
  onUpdateColumns,
  onClose,
}) => {
  const [localColumns, setLocalColumns] = useState(columns);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleToggleVisibility = (index: number) => {
    const updated = [...localColumns];
    updated[index] = { ...updated[index], visible: !updated[index].visible };
    setLocalColumns(updated);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    const updated = [...localColumns];
    const draggedColumn = updated[draggedIndex];
    updated.splice(draggedIndex, 1);
    updated.splice(dropIndex, 0, draggedColumn);

    setLocalColumns(updated);
    setDraggedIndex(null);
  };

  const handleSave = () => {
    onUpdateColumns(localColumns);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-96 max-h-[420px] overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Manage Columns</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {localColumns.map((column, index) => (
            <div
              key={column.key}
              className="flex items-center gap-3 p-2 border rounded hover:bg-gray-50 cursor-move"
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
            >
              <div className="text-gray-400">⋮⋮</div>
              <input
                type="checkbox"
                checked={column.visible}
                onChange={() => handleToggleVisibility(index)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="flex-1 text-sm">{column.label}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-4 pt-4 border-t">
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColumnManager;
