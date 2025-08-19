import { useState, useEffect, useMemo } from 'react';
import { Deal, SortConfig, FilterConfig, ColumnConfig } from '@/lib/types';

interface TableState {
  sortConfigs: SortConfig[];
  filters: FilterConfig;
  selectedRows: Set<string>;
  expandedRows: Set<string>;
  columns: ColumnConfig[];
}

export const useTableState = (initialData: Deal[], initialColumns: ColumnConfig[]) => {
  const [state, setState] = useState<TableState>({
    sortConfigs: [],
    filters: {},
    selectedRows: new Set(),
    expandedRows: new Set(),
    columns: initialColumns,
  });

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('deals-table-state');
    if (saved) {
      try {
        const parsedState = JSON.parse(saved);
        setState(prevState => ({
          ...prevState,
          sortConfigs: parsedState.sortConfigs || [],
          filters: parsedState.filters || {},
          columns: parsedState.columns || initialColumns,
        }));
      } catch (error) {
        console.warn('Failed to load table state from localStorage:', error);
      }
    }
  }, [initialColumns]);

  // Save state to localStorage when it changes
  useEffect(() => {
    const stateToSave = {
      sortConfigs: state.sortConfigs,
      filters: state.filters,
      columns: state.columns,
    };
    localStorage.setItem('deals-table-state', JSON.stringify(stateToSave));
  }, [state.sortConfigs, state.filters, state.columns]);

  // Filter and sort data
  const processedData = useMemo(() => {
    let filtered = [...initialData];

    // Apply filters
    if (state.filters.search) {
      const search = state.filters.search.toLowerCase();
      filtered = filtered.filter(deal =>
        deal.dealName.toLowerCase().includes(search) ||
        deal.company.toLowerCase().includes(search) ||
        deal.owner.toLowerCase().includes(search)
      );
    }

    if (state.filters.status?.length) {
      filtered = filtered.filter(deal => state.filters.status!.includes(deal.status));
    }

    if (state.filters.owner?.length) {
      filtered = filtered.filter(deal => state.filters.owner!.includes(deal.owner));
    }

    if (state.filters.amountRange) {
      const { min, max } = state.filters.amountRange;
      filtered = filtered.filter(deal => deal.amount >= min && deal.amount <= max);
    }

    // Date range filter (by closeDate)
    if (state.filters.dateRange?.start || state.filters.dateRange?.end) {
      const start = state.filters.dateRange.start
        ? new Date(state.filters.dateRange.start).getTime()
        : Number.NEGATIVE_INFINITY;
      const end = state.filters.dateRange.end
        ? new Date(state.filters.dateRange.end).getTime()
        : Number.POSITIVE_INFINITY;
      filtered = filtered.filter(deal => {
        const d = new Date(deal.closeDate).getTime();
        return d >= start && d <= end;
      });
    }

    // Apply sorting
    if (state.sortConfigs.length > 0) {
      filtered.sort((a, b) => {
        for (const { key, direction } of state.sortConfigs) {
          let aVal = a[key];
          let bVal = b[key];

          // Handle different data types
          if (typeof aVal === 'string' && typeof bVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
          }

          if (aVal < bVal) return direction === 'asc' ? -1 : 1;
          if (aVal > bVal) return direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [initialData, state.sortConfigs, state.filters]);

  // Actions
  const toggleSort = (key: keyof Deal, isShiftClick: boolean = false) => {
    setState(prev => {
      let newSortConfigs = [...prev.sortConfigs];

      if (isShiftClick) {
        // Multi-column sort
        const existingIndex = newSortConfigs.findIndex(config => config.key === key);
        if (existingIndex >= 0) {
          const existing = newSortConfigs[existingIndex];
          if (existing.direction === 'asc') {
            newSortConfigs[existingIndex] = { ...existing, direction: 'desc' };
          } else {
            newSortConfigs.splice(existingIndex, 1);
          }
        } else {
          newSortConfigs.push({ key, direction: 'asc' });
        }
      } else {
        // Single column sort
        const existing = newSortConfigs.find(config => config.key === key);
        if (existing) {
          if (existing.direction === 'asc') {
            newSortConfigs = [{ key, direction: 'desc' }];
          } else {
            newSortConfigs = [];
          }
        } else {
          newSortConfigs = [{ key, direction: 'asc' }];
        }
      }

      return { ...prev, sortConfigs: newSortConfigs };
    });
  };

  // Explicitly set sort for a column and direction. If additive=true, keep other sorts.
  const setSort = (key: keyof Deal, direction: 'asc' | 'desc', additive: boolean = false) => {
    setState(prev => {
      let newSortConfigs: SortConfig[];
      if (additive) {
        newSortConfigs = prev.sortConfigs.filter(c => c.key !== key);
        newSortConfigs.push({ key, direction });
      } else {
        newSortConfigs = [{ key, direction }];
      }
      return { ...prev, sortConfigs: newSortConfigs };
    });
  };

  const updateFilters = (newFilters: Partial<FilterConfig>) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...newFilters }
    }));
  };

  const toggleRowSelection = (id: string, isShiftClick: boolean = false) => {
    setState(prev => {
      const newSelected = new Set(prev.selectedRows);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        if (!isShiftClick) {
          newSelected.clear();
        }
        newSelected.add(id);
      }
      return { ...prev, selectedRows: newSelected };
    });
  };

  const selectAllRows = (selectAll: boolean) => {
    setState(prev => ({
      ...prev,
      selectedRows: selectAll ? new Set(processedData.map(deal => deal.id)) : new Set()
    }));
  };

  const toggleRowExpansion = (id: string) => {
    setState(prev => {
      const newExpanded = new Set(prev.expandedRows);
      if (newExpanded.has(id)) {
        newExpanded.delete(id);
      } else {
        newExpanded.add(id);
      }
      return { ...prev, expandedRows: newExpanded };
    });
  };

  const updateColumns = (newColumns: ColumnConfig[]) => {
    setState(prev => ({ ...prev, columns: newColumns }));
  };

  const clearFilters = () => {
    setState(prev => ({ ...prev, filters: {} }));
  };

  return {
    data: processedData,
    sortConfigs: state.sortConfigs,
    filters: state.filters,
    selectedRows: state.selectedRows,
    expandedRows: state.expandedRows,
    columns: state.columns,
    toggleSort,
    setSort,
    updateFilters,
    toggleRowSelection,
    selectAllRows,
    toggleRowExpansion,
    updateColumns,
    clearFilters,
  };
};
