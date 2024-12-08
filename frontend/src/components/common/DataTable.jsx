import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Checkbox,
  IconButton,
  Tooltip,
  LinearProgress,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useTable } from '../../hooks/useTable';

const DataTable = ({
  columns,
  data,
  loading = false,
  selectable = false,
  onEdit,
  onDelete,
  onView,
  initialSort = { field: '', direction: 'asc' },
  rowsPerPageOptions = [5, 10, 25],
  defaultRowsPerPage = 10,
}) => {
  const {
    data: tableData,
    sortConfig,
    handleSort,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    selected,
    handleSelect,
    handleSelectAll,
  } = useTable(data, {
    initialSort,
    initialRowsPerPage: defaultRowsPerPage,
  });

  const handleAction = (action, row) => (event) => {
    event.stopPropagation();
    action(row);
  };

  const renderCell = (row, column) => {
    if (column.render) {
      return column.render(row[column.field], row);
    }

    return row[column.field];
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selected.length > 0 && selected.length < data.length
                    }
                    checked={selected.length === data.length}
                    onChange={(event) => handleSelectAll(event.target.checked)}
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell
                  key={column.field}
                  align={column.align || 'left'}
                  style={{ minWidth: column.minWidth }}
                  sortDirection={
                    sortConfig.field === column.field ? sortConfig.direction : false
                  }
                >
                  {column.sortable !== false ? (
                    <TableSortLabel
                      active={sortConfig.field === column.field}
                      direction={
                        sortConfig.field === column.field
                          ? sortConfig.direction
                          : 'asc'
                      }
                      onClick={() => handleSort(column.field)}
                    >
                      {column.headerName}
                    </TableSortLabel>
                  ) : (
                    column.headerName
                  )}
                </TableCell>
              ))}
              {(onEdit || onDelete || onView) && (
                <TableCell align="right">Actions</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={
                    columns.length +
                    (selectable ? 1 : 0) +
                    ((onEdit || onDelete || onView) ? 1 : 0)
                  }
                >
                  <LinearProgress />
                </TableCell>
              </TableRow>
            ) : tableData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    columns.length +
                    (selectable ? 1 : 0) +
                    ((onEdit || onDelete || onView) ? 1 : 0)
                  }
                  align="center"
                >
                  <Typography variant="body2" color="textSecondary">
                    No data available
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              tableData.map((row) => (
                <TableRow
                  hover
                  key={row.id}
                  onClick={
                    selectable ? () => handleSelect(row.id) : undefined
                  }
                  selected={selected.includes(row.id)}
                  sx={{ cursor: selectable ? 'pointer' : 'default' }}
                >
                  {selectable && (
                    <TableCell padding="checkbox">
                      <Checkbox checked={selected.includes(row.id)} />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell
                      key={column.field}
                      align={column.align || 'left'}
                    >
                      {renderCell(row, column)}
                    </TableCell>
                  ))}
                  {(onEdit || onDelete || onView) && (
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {onView && (
                          <Tooltip title="View">
                            <IconButton
                              size="small"
                              onClick={handleAction(onView, row)}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        {onEdit && (
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={handleAction(onEdit, row)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        {onDelete && (
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={handleAction(onDelete, row)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default DataTable;
