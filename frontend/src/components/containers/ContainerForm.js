import React, { useEffect } from 'react';
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
  FormHelperText,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  serialNumber: yup.string().required('Serial number is required'),
  type: yup.string().required('Container type is required'),
  capacity: yup.number()
    .required('Capacity is required')
    .positive('Capacity must be positive')
    .integer('Capacity must be an integer'),
  status: yup.string().required('Status is required'),
  location: yup.string().required('Current location is required'),
  lastCleanedDate: yup.date().nullable(),
  nextMaintenanceDate: yup.date().nullable(),
});

const ContainerForm = ({ open, onClose, onSubmit, initialValues, mode = 'create' }) => {
  const formik = useFormik({
    initialValues: initialValues || {
      serialNumber: '',
      type: '',
      capacity: '',
      status: 'available',
      location: '',
      lastCleanedDate: '',
      nextMaintenanceDate: '',
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
    }
  }, [initialValues]);

  const containerTypes = [
    { value: 'sharps', label: 'Sharps Container' },
    { value: 'biohazard', label: 'Biohazard Waste' },
    { value: 'pharmaceutical', label: 'Pharmaceutical Waste' },
    { value: 'chemotherapy', label: 'Chemotherapy Waste' },
    { value: 'pathological', label: 'Pathological Waste' },
  ];

  const containerStatuses = [
    { value: 'available', label: 'Available' },
    { value: 'in_use', label: 'In Use' },
    { value: 'maintenance', label: 'Under Maintenance' },
    { value: 'cleaning', label: 'Being Cleaned' },
    { value: 'damaged', label: 'Damaged' },
    { value: 'retired', label: 'Retired' },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === 'create' ? 'Add New Container' : 'Edit Container'}
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="serialNumber"
                name="serialNumber"
                label="Serial Number"
                value={formik.values.serialNumber}
                onChange={formik.handleChange}
                error={formik.touched.serialNumber && Boolean(formik.errors.serialNumber)}
                helperText={formik.touched.serialNumber && formik.errors.serialNumber}
                disabled={mode === 'edit'}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl 
                fullWidth
                error={formik.touched.type && Boolean(formik.errors.type)}
              >
                <InputLabel>Container Type</InputLabel>
                <Select
                  name="type"
                  value={formik.values.type}
                  label="Container Type"
                  onChange={formik.handleChange}
                >
                  {containerTypes.map((type) => (
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
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="capacity"
                name="capacity"
                label="Capacity (liters)"
                type="number"
                value={formik.values.capacity}
                onChange={formik.handleChange}
                error={formik.touched.capacity && Boolean(formik.errors.capacity)}
                helperText={formik.touched.capacity && formik.errors.capacity}
              />
            </Grid>
            <Grid item xs={12} md={6}>
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
                  {containerStatuses.map((status) => (
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="location"
                name="location"
                label="Current Location"
                value={formik.values.location}
                onChange={formik.handleChange}
                error={formik.touched.location && Boolean(formik.errors.location)}
                helperText={formik.touched.location && formik.errors.location}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="lastCleanedDate"
                name="lastCleanedDate"
                label="Last Cleaned Date"
                type="date"
                value={formik.values.lastCleanedDate}
                onChange={formik.handleChange}
                InputLabelProps={{ shrink: true }}
                error={formik.touched.lastCleanedDate && Boolean(formik.errors.lastCleanedDate)}
                helperText={formik.touched.lastCleanedDate && formik.errors.lastCleanedDate}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="nextMaintenanceDate"
                name="nextMaintenanceDate"
                label="Next Maintenance Date"
                type="date"
                value={formik.values.nextMaintenanceDate}
                onChange={formik.handleChange}
                InputLabelProps={{ shrink: true }}
                error={formik.touched.nextMaintenanceDate && Boolean(formik.errors.nextMaintenanceDate)}
                helperText={formik.touched.nextMaintenanceDate && formik.errors.nextMaintenanceDate}
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
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {mode === 'create' ? 'Add Container' : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ContainerForm;
