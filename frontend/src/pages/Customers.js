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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  selectCustomers,
  selectTotalCount,
  selectCurrentPage,
  selectLoading,
  setCurrentPage,
} from '../store/slices/customerSlice';
import { showConfirmDialog } from '../store/slices/uiSlice';
import CustomerForm from '../components/customers/CustomerForm';

const Customers = () => {
  const dispatch = useDispatch();
  const customers = useSelector(selectCustomers);
  const totalCount = useSelector(selectTotalCount);
  const currentPage = useSelector(selectCurrentPage);
  const loading = useSelector(selectLoading);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    loadCustomers();
  }, [currentPage, rowsPerPage, searchQuery]);

  const loadCustomers = () => {
    dispatch(
      fetchCustomers({
        page: currentPage,
        limit: rowsPerPage,
        search: searchQuery,
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

  const handleAddClick = () => {
    setSelectedCustomer(null);
    setFormOpen(true);
  };

  const handleEditClick = (customer) => {
    setSelectedCustomer(customer);
    setFormOpen(true);
  };

  const handleDeleteClick = (customer) => {
    dispatch(
      showConfirmDialog({
        title: 'Delete Customer',
        message: `Are you sure you want to delete ${customer.name}?`,
        onConfirm: () => dispatch(deleteCustomer(customer.id)),
      })
    );
  };

  const handleFormSubmit = async (values) => {
    if (selectedCustomer) {
      await dispatch(updateCustomer({ id: selectedCustomer.id, data: values }));
    } else {
      await dispatch(createCustomer(values));
    }
    setFormOpen(false);
    loadCustomers();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Customers</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          Add Customer
        </Button>
      </Box>

      <Paper sx={{ mb: 2, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
          <TextField
            label="Search Customers"
            variant="outlined"
            size="small"
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>
                    {customer.type.charAt(0).toUpperCase() + customer.type.slice(1)}
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.city}</TableCell>
                  <TableCell>
                    <Chip
                      label={customer.status}
                      color={getStatusColor(customer.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleEditClick(customer)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(customer)}
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

      <CustomerForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialValues={selectedCustomer}
        mode={selectedCustomer ? 'edit' : 'create'}
      />
    </Box>
  );
};

export default Customers;
