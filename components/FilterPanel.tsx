"use client";

import React, { useState } from "react";
import { FilterConfig, DealStatus, Deal, STATUS_OPTIONS } from "@/lib/types";
import { getUniqueValues } from "@/lib/data";

interface FilterPanelProps {
  filters: FilterConfig;
  onUpdateFilters: (filters: Partial<FilterConfig>) => void;
  data: Deal[];
  isOpen: boolean;
  onClose: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onUpdateFilters,
  data,
  isOpen,
  onClose,
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  if (!isOpen) return null;

  const statusOptions: DealStatus[] = STATUS_OPTIONS;
  const ownerOptions = getUniqueValues(data, "owner");

  const handleStatusChange = (status: DealStatus, checked: boolean) => {
    const currentStatus = localFilters.status || [];
    const updated = checked
      ? [...currentStatus, status]
      : currentStatus.filter((s) => s !== status);

    setLocalFilters({ ...localFilters, status: updated });
  };

  const handleOwnerChange = (owner: string, checked: boolean) => {
    const currentOwners = localFilters.owner || [];
    const updated = checked
      ? [...currentOwners, owner]
      : currentOwners.filter((o) => o !== owner);

    setLocalFilters({ ...localFilters, owner: updated });
  };

  const handleAmountRangeChange = (field: "min" | "max", value: string) => {
    const numValue = parseFloat(value) || 0;
    const currentRange = localFilters.amountRange || { min: 0, max: 1000000 };

    setLocalFilters({
      ...localFilters,
      amountRange: { ...currentRange, [field]: numValue },
    });
  };

  const applyFilters = () => {
    onUpdateFilters(localFilters);
    onClose();
  };

  const clearFilters = () => {
    setLocalFilters({});
    onUpdateFilters({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/10 bg-opacity-50 flex items-start justify-end z-50">
      <div className="bg-white h-full w-80 shadow-xl overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Filters</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close filters panel"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Status Filter */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Status</h4>
            <div className="space-y-2">
              {statusOptions.map((status) => (
                <label key={status} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={localFilters.status?.includes(status) || false}
                    onChange={(e) =>
                      handleStatusChange(status, e.target.checked)
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    aria-label={`Filter by status ${status}`}
                  />
                  <span className="text-sm">{status}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Owner Filter */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Owner</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {ownerOptions.map((owner) => (
                <label key={owner} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={localFilters.owner?.includes(owner) || false}
                    onChange={(e) => handleOwnerChange(owner, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    aria-label={`Filter by owner ${owner}`}
                  />
                  <span className="text-sm">{owner}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Amount Range Filter */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Amount Range</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Min Amount
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={localFilters.amountRange?.min || ""}
                  onChange={(e) =>
                    handleAmountRangeChange("min", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Minimum amount"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Max Amount
                </label>
                <input
                  type="number"
                  placeholder="1000000"
                  value={localFilters.amountRange?.max || ""}
                  onChange={(e) =>
                    handleAmountRangeChange("max", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Maximum amount"
                />
              </div>
            </div>
          </div>

          {/* Date Range Filter */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Close Date Range</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={localFilters.dateRange?.start || ""}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      dateRange: {
                        start: e.target.value,
                        end: localFilters.dateRange?.end || "",
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Start date"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={localFilters.dateRange?.end || ""}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      dateRange: {
                        start: localFilters.dateRange?.start || "",
                        end: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="End date"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-2">
            <button
              onClick={applyFilters}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Apply Filters
            </button>
            <button
              onClick={clearFilters}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
