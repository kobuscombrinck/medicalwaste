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
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Update as UpdateIcon,
  PictureAsPdf as PdfIcon,
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchDeliveries,
  createDelivery,
  updateDelivery,
  deleteDelivery,
  updateDeliveryStatus,
  generateManifest,
  selectDeliveries,
  selectTotalCount,
  selectCurrentPage,
  selectLoading,
  setCurrentPage,
} from '../store/slices/deliverySlice';
import { showConfirmDialog } from '../store/slices/uiSlice';
import DeliveryForm from '../components/deliveries/DeliveryForm';
import DeliveryStatusUpdate from '../components/deliveries/DeliveryStatusUpdate';

const Deliveries = () => {
  const dispatch = useDispatch();
  const deliveries = useSelector(selectDeliveries);
  const totalCount = useSelector(selectTotalCount);
  const currentPage = useSelector(selectCurrentPage);
  const loading = useSelector(selectLoading);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [statusUpdateOpen, setStatusUpdateOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  useEffect(() => {
    loadDeliveries();
  }, [currentPage, rowsPerPage, searchQuery, statusFilter, selectedDate]);

  const loadDeliveries = () => {
    dispatch(
      fetchDeliveries({
        page: currentPage,
        limit: rowsPerPage,
        search: searchQuery,
        status: statusFilter,
        date: selectedDate?.toISOString().split('T')[0],
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

  const handleDateChange = (date) => {
    setSelectedDate(date);
    dispatch(setCurrentPage(1));
  };

  const handleAddClick = () => {
    setSelectedDelivery(null);
    setFormOpen(true);
  };

  const handleEditClick = (delivery) => {
    setSelectedDelivery(delivery);
    setFormOpen(true);
  };

  const handleDeleteClick = (delivery) => {
    dispatch(
      showConfirmDialog({
        title: 'Delete Delivery',
        message: `Are you sure you want to delete this delivery?`,
        onConfirm: () => dispatch(deleteDelivery(delivery.id)),
      })
    );
  };

  const handleStatusUpdateClick = (delivery) => {
    setSelectedDelivery(delivery);
    setStatusUpdateOpen(true);
  };

  const handleGenerateManifest = async (delivery) => {
    try {
      const blob = await dispatch(generateManifest(delivery.id)).unwrap();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `manifest-${delivery.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      // Error handling is done by the slice
    }
  };

  const handleFormSubmit = async (values) => {
    if (selectedDelivery) {
      await dispatch(updateDelivery({ id: selectedDelivery.id, data: values }));
    } else {
      await dispatch(createDelivery(values));
    }
    setFormOpen(false);
    loadDeliveries();
  };

  const handleStatusUpdate = async (values) => {
    await dispatch(
      updateDeliveryStatus({
        id: selectedDelivery.id,
        status: values.status,
        notes: values.notes,
      })
    );
    setStatusUpdateOpen(false);
    loadDeliveries();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'info';
      case 'in_transit':
        return 'warning';
      case 'arrived':
        return 'secondary';
      case 'in_progress':
        return 'primary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low':
        return 'success';
      case 'normal':
        return 'info';
      case 'high':
        return 'warning';
      case 'urgent':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Deliveries</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          Schedule Delivery
        </Button>
      </Box>

      <Paper sx={{ mb: 2, p: 2 }}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search deliveries..."
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={handleStatusFilterChange}
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="scheduled">Scheduled</MenuItem>
                <MenuItem value="in_transit">In Transit</MenuItem>
                <MenuItem value="arrived">Arrived</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <DatePicker
              label="Filter by Date"
              value={selectedDate}
              onChange={handleDateChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <CalendarIcon sx={{ color: 'action.active', mr: 1 }} />
                    ),
                  }}
                />
              )}
            />
          </Grid>
        </Grid>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Scheduled Date</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Driver</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deliveries.map((delivery) => (
                <TableRow key={delivery.id}>
                  <TableCell>{delivery.id}</TableCell>
                  <TableCell>{delivery.customer.name}</TableCell>
                  <TableCell>
                    {delivery.type.charAt(0).toUpperCase() + delivery.type.slice(1)}
                  </TableCell>
                  <TableCell>
                    {new Date(delivery.scheduledDate).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={delivery.priority}
                      color={getPriorityColor(delivery.priority)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={delivery.status}
                      color={getStatusColor(delivery.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {delivery.driver ? delivery.driver.name : 'Unassigned'}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Update Status">
                      <IconButton
                        size="small"
                        onClick={() => handleStatusUpdateClick(delivery)}
                      >
                        <UpdateIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Generate Manifest">
                      <IconButton
                        size="small"
                        onClick={() => handleGenerateManifest(delivery)}
                      >
                        <PdfIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleEditClick(delivery)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(delivery)}
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

      <DeliveryForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialValues={selectedDelivery}
        mode={selectedDelivery ? 'edit' : 'create'}
      />

      <DeliveryStatusUpdate
        open={statusUpdateOpen}
        onClose={() => setStatusUpdateOpen(false)}
        onSubmit={handleStatusUpdate}
        currentStatus={selectedDelivery?.status}
      />
    </Box>
  );
};

export default Deliveries;
