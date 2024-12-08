import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  FormHelperText,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import { selectCustomers } from '../../store/slices/customerSlice';

const validationSchema = yup.object({
  customerId: yup.string().required('Customer is required'),
  scheduledDate: yup.date().required('Scheduled date is required'),
  type: yup.string().required('Delivery type is required'),
  status: yup.string().required('Status is required'),
  priority: yup.string().required('Priority is required'),
  containers: yup.array().min(1, 'At least one container must be selected'),
  notes: yup.string(),
});

const DeliveryForm = ({ open, onClose, onSubmit, initialValues, mode = 'create' }) => {
  const customers = useSelector(selectCustomers);
  const [selectedContainers, setSelectedContainers] = useState([]);
  const [availableContainers, setAvailableContainers] = useState([]); // This would be populated from API

  const formik = useFormik({
    initialValues: initialValues || {
      customerId: '',
      scheduledDate: new Date(),
      type: 'pickup',
      status: 'scheduled',
      priority: 'normal',
      containers: [],
      notes: '',
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  useEffect(() => {
    if (initialValues) {
      formik.setValues(initialValues);
      setSelectedContainers(initialValues.containers || []);
    }
  }, [initialValues]);

  const deliveryTypes = [
    { value: 'pickup', label: 'Pickup' },
    { value: 'delivery', label: 'Delivery' },
    { value: 'exchange', label: 'Exchange' },
  ];

  const deliveryStatuses = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const priorities = [
    { value: 'low', label: 'Low' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ];

  const handleContainerChange = (event, newValue) => {
    setSelectedContainers(newValue);
    formik.setFieldValue('containers', newValue.map(container => container.id));
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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === 'create' ? 'Schedule New Delivery' : 'Edit Delivery'}
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl 
                fullWidth
                error={formik.touched.customerId && Boolean(formik.errors.customerId)}
              >
                <InputLabel>Customer</InputLabel>
                <Select
                  name="customerId"
                  value={formik.values.customerId}
                  label="Customer"
                  onChange={formik.handleChange}
                >
                  {customers.map((customer) => (
                    <MenuItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.customerId && formik.errors.customerId && (
                  <FormHelperText>{formik.errors.customerId}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <DateTimePicker
                label="Scheduled Date & Time"
                value={formik.values.scheduledDate}
                onChange={(value) => formik.setFieldValue('scheduledDate', value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={formik.touched.scheduledDate && Boolean(formik.errors.scheduledDate)}
                    helperText={formik.touched.scheduledDate && formik.errors.scheduledDate}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl 
                fullWidth
                error={formik.touched.type && Boolean(formik.errors.type)}
              >
                <InputLabel>Delivery Type</InputLabel>
                <Select
                  name="type"
                  value={formik.values.type}
                  label="Delivery Type"
                  onChange={formik.handleChange}
                >
                  {deliveryTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.type && formik.errors.type && (
                  <FormHelperText>{formik.errors.type}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl 
                fullWidth
                error={formik.touched.status && Boolean(formik.errors.status)}
              >
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formik.values.status}
                  label="Status"
                  onChange={formik.handleChange}
                >
                  {deliveryStatuses.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.status && formik.errors.status && (
                  <FormHelperText>{formik.errors.status}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl 
                fullWidth
                error={formik.touched.priority && Boolean(formik.errors.priority)}
              >
                <InputLabel>Priority</InputLabel>
                <Select
                  name="priority"
                  value={formik.values.priority}
                  label="Priority"
                  onChange={formik.handleChange}
                >
                  {priorities.map((priority) => (
                    <MenuItem key={priority.value} value={priority.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Chip
                          label={priority.label}
                          size="small"
                          color={getPriorityColor(priority.value)}
                          sx={{ mr: 1 }}
                        />
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.priority && formik.errors.priority && (
                  <FormHelperText>{formik.errors.priority}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                multiple
                id="containers"
                options={availableContainers}
                value={selectedContainers}
                onChange={handleContainerChange}
                getOptionLabel={(option) => `${option.serialNumber} - ${option.type}`}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Containers"
                    error={formik.touched.containers && Boolean(formik.errors.containers)}
                    helperText={formik.touched.containers && formik.errors.containers}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option.serialNumber}
                      {...getTagProps({ index })}
                      color="primary"
                      variant="outlined"
                    />
                  ))
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="notes"
                name="notes"
                label="Notes"
                multiline
                rows={4}
                value={formik.values.notes}
                onChange={formik.handleChange}
                error={formik.touched.notes && Boolean(formik.errors.notes)}
                helperText={formik.touched.notes && formik.errors.notes}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {mode === 'create' ? 'Schedule Delivery' : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DeliveryForm;
