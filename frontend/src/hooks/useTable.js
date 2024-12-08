import { useState, useMemo, useCallback } from 'react';

export const useTable = (data = [], options = {}) => {
  const {
    initialSort = { field: '', direction: 'asc' },
    initialPage = 0,
    initialRowsPerPage = 10,
    initialFilters = {},
  } = options;

  // State
  const [page, setPage] = useState(initialPage);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [sortConfig, setSortConfig] = useState(initialSort);
  const [filters, setFilters] = useState(initialFilters);
  const [selected, setSelected] = useState([]);

  // Sorting
  const handleSort = useCallback((field) => {
    setSortConfig((prevSort) => ({
      field,
      direction:
        prevSort.field === field && prevSort.direction === 'asc'
          ? 'desc'
          : 'asc',
    }));
    setPage(0); // Reset to first page when sorting
  }, []);

  // Filtering
  const handleFilter = useCallback((field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
    setPage(0); // Reset to first page when filtering
  }, []);

  // Selection
  const handleSelect = useCallback((id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  }, []);

  const handleSelectAll = useCallback((checked) => {
    setSelected(checked ? processedData.map((item) => item.id) : []);
  }, [data]);

  // Pagination
  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  // Process data with sorting and filtering
  const processedData = useMemo(() => {
    let result = [...data];

    // Apply filters
    Object.keys(filters).forEach((key) => {
      const filterValue = filters[key];
      if (filterValue) {
        result = result.filter((item) => {
          const itemValue = item[key];
          if (typeof filterValue === 'string') {
            return itemValue.toLowerCase().includes(filterValue.toLowerCase());
          }
          return itemValue === filterValue;
        });
      }
    });

    // Apply sorting
    if (sortConfig.field) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.field];
        const bValue = b[sortConfig.field];

        if (aValue === bValue) return 0;

        const comparison = aValue < bValue ? -1 : 1;
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [data, sortConfig, filters]);

  // Calculate pagination
  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return processedData.slice(startIndex, startIndex + rowsPerPage);
  }, [processedData, page, rowsPerPage]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(processedData.length / rowsPerPage);
  }, [processedData, rowsPerPage]);

  // Reset pagination when data changes
  useMemo(() => {
    if (page >= totalPages) {
      setPage(Math.max(0, totalPages - 1));
    }
  }, [totalPages, page]);

  return {
    // Data
    data: paginatedData,
    processedData,
    totalCount: processedData.length,

    // Sorting
    sortConfig,
    handleSort,

    // Filtering
    filters,
    handleFilter,

    // Selection
    selected,
    handleSelect,
    handleSelectAll,

    // Pagination
    page,
    rowsPerPage,
    totalPages,
    handleChangePage,
    handleChangeRowsPerPage,

    // Reset functions
    resetSort: () => setSortConfig(initialSort),
    resetFilters: () => setFilters(initialFilters),
    resetPagination: () => {
      setPage(initialPage);
      setRowsPerPage(initialRowsPerPage);
    },
    resetSelection: () => setSelected([]),
    resetAll: () => {
      setSortConfig(initialSort);
      setFilters(initialFilters);
      setPage(initialPage);
      setRowsPerPage(initialRowsPerPage);
      setSelected([]);
    },
  };
};

export default useTable;
