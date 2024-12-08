import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  TextField,
  Chip,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  History as HistoryIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchContainers,
  createContainer,
  updateContainer,
  deleteContainer,
  fetchContainerHistory,
  selectContainers,
  selectTotalCount,
  selectCurrentPage,
  selectLoading,
  setCurrentPage,
} from '../store/slices/containerSlice';
import { showConfirmDialog } from '../store/slices/uiSlice';
import ContainerForm from '../components/containers/ContainerForm';
import ContainerHistory from '../components/containers/ContainerHistory';

const Containers = () => {
  const dispatch = useDispatch();
  const containers = useSelector(selectContainers);
  const totalCount = useSelector(selectTotalCount);
  const currentPage = useSelector(selectCurrentPage);
  const loading = useSelector(selectLoading);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectedContainer, setSelectedContainer] = useState(null);

  useEffect(() => {
    loadContainers();
  }, [currentPage, rowsPerPage, searchQuery, statusFilter]);

  const loadContainers = () => {
    dispatch(
      fetchContainers({
        page: currentPage,
        limit: rowsPerPage,
        search: searchQuery,
        status: statusFilter,
      })
    );
  };

  const handleChangePage = (event, newPage) => {
    dispatch(setCurrentPage(newPage + 1));
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    dispatch(setCurrentPage(1));
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    dispatch(setCurrentPage(1));
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    dispatch(setCurrentPage(1));
  };

  const handleAddClick = () => {
    setSelectedContainer(null);
    setFormOpen(true);
  };

  const handleEditClick = (container) => {
    setSelectedContainer(container);
    setFormOpen(true);
  };

  const handleDeleteClick = (container) => {
    dispatch(
      showConfirmDialog({
        title: 'Delete Container',
        message: `Are you sure you want to delete container ${container.serialNumber}?`,
        onConfirm: () => dispatch(deleteContainer(container.id)),
      })
    );
  };

  const handleHistoryClick = (container) => {
    setSelectedContainer(container);
    dispatch(fetchContainerHistory(container.id));
    setHistoryOpen(true);
  };

  const handleFormSubmit = async (values) => {
    if (selectedContainer) {
      await dispatch(updateContainer({ id: selectedContainer.id, data: values }));
    } else {
      await dispatch(createContainer(values));
    }
    setFormOpen(false);
    loadContainers();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'success';
      case 'in_use':
        return 'primary';
      case 'maintenance':
        return 'warning';
      case 'cleaning':
        return 'info';
      case 'damaged':
        return 'error';
      case 'retired':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Containers</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          Add Container
        </Button>
      </Box>

      <Paper sx={{ mb: 2, p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            label="Search Containers"
            variant="outlined"
            size="small"
            sx={{ flexGrow: 1 }}
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
            }}
          />
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={statusFilter}
              label="Filter by Status"
              onChange={handleStatusFilterChange}
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="available">Available</MenuItem>
              <MenuItem value="in_use">In Use</MenuItem>
              <MenuItem value="maintenance">Under Maintenance</MenuItem>
              <MenuItem value="cleaning">Being Cleaned</MenuItem>
              <MenuItem value="damaged">Damaged</MenuItem>
              <MenuItem value="retired">Retired</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Serial Number</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Capacity</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Last Cleaned</TableCell>
                <TableCell>Next Maintenance</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {containers.map((container) => (
                <TableRow key={container.id}>
                  <TableCell>{container.serialNumber}</TableCell>
                  <TableCell>
                    {container.type.charAt(0).toUpperCase() + container.type.slice(1)}
                  </TableCell>
                  <TableCell>{container.capacity} L</TableCell>
                  <TableCell>{container.location}</TableCell>
                  <TableCell>
                    {container.lastCleanedDate
                      ? new Date(container.lastCleanedDate).toLocaleDateString()
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {container.nextMaintenanceDate
                      ? new Date(container.nextMaintenanceDate).toLocaleDateString()
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(container.status)}
                      color={getStatusColor(container.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View History">
                      <IconButton
                        size="small"
                        onClick={() => handleHistoryClick(container)}
                      >
                        <HistoryIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleEditClick(container)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(container)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={totalCount}
          page={currentPage - 1}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>

      <ContainerForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialValues={selectedContainer}
        mode={selectedContainer ? 'edit' : 'create'}
      />

      <ContainerHistory
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        containerId={selectedContainer?.id}
      />
    </Box>
  );
};

export default Containers;
