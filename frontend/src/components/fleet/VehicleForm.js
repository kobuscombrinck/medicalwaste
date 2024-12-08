import React from 'react';
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
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { createVehicle, updateVehicle } from '../../store/slices/vehicleSlice';

const validationSchema = yup.object({
  registrationNumber: yup.string().required('Registration number is required'),
  make: yup.string().required('Make is required'),
  model: yup.string().required('Model is required'),
  year: yup
    .number()
    .required('Year is required')
    .min(1900, 'Invalid year')
    .max(new Date().getFullYear() + 1, 'Invalid year'),
  vin: yup.string().required('VIN is required'),
  status: yup.string().required('Status is required'),
  mileage: yup
    .number()
    .required('Mileage is required')
    .min(0, 'Invalid mileage'),
  fuelType: yup.string().required('Fuel type is required'),
  lastService: yup.date().required('Last service date is required'),
  nextServiceDue: yup
    .date()
    .required('Next service date is required')
    .min(yup.ref('lastService'), 'Next service must be after last service'),
  insuranceNumber: yup.string().required('Insurance number is required'),
  insuranceExpiry: yup.date().required('Insurance expiry date is required'),
  notes: yup.string(),
});

const VehicleForm = ({ open, onClose, vehicle }) => {
  const dispatch = useDispatch();
  const isEdit = Boolean(vehicle);

  const formik = useFormik({
    initialValues: {
      registrationNumber: vehicle?.registrationNumber || '',
      make: vehicle?.make || '',
      model: vehicle?.model || '',
      year: vehicle?.year || new Date().getFullYear(),
      vin: vehicle?.vin || '',
      status: vehicle?.status || 'active',
      mileage: vehicle?.mileage || 0,
      fuelType: vehicle?.fuelType || '',
      lastService: vehicle?.lastService || new Date().toISOString().split('T')[0],
      nextServiceDue:
        vehicle?.nextServiceDue || new Date().toISOString().split('T')[0],
      insuranceNumber: vehicle?.insuranceNumber || '',
      insuranceExpiry:
        vehicle?.insuranceExpiry || new Date().toISOString().split('T')[0],
      notes: vehicle?.notes || '',
    },
    validationSchema,
    onSubmit: async (values) => {
      if (isEdit) {
        await dispatch(updateVehicle({ id: vehicle._id, data: values }));
      } else {
        await dispatch(createVehicle(values));
      }
      onClose();
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        {isEdit ? 'Edit Vehicle' : 'Add New Vehicle'}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="registrationNumber"
                label="Registration Number"
                value={formik.values.registrationNumber}
                onChange={formik.handleChange}
                error={
                  formik.touched.registrationNumber &&
                  Boolean(formik.errors.registrationNumber)
                }
                helperText={
                  formik.touched.registrationNumber &&
                  formik.errors.registrationNumber
                }
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="vin"
                label="VIN"
                value={formik.values.vin}
                onChange={formik.handleChange}
                error={formik.touched.vin && Boolean(formik.errors.vin)}
                helperText={formik.touched.vin && formik.errors.vin}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                name="make"
                label="Make"
                value={formik.values.make}
                onChange={formik.handleChange}
                error={formik.touched.make && Boolean(formik.errors.make)}
                helperText={formik.touched.make && formik.errors.make}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                name="model"
                label="Model"
                value={formik.values.model}
                onChange={formik.handleChange}
                error={formik.touched.model && Boolean(formik.errors.model)}
                helperText={formik.touched.model && formik.errors.model}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                name="year"
                label="Year"
                type="number"
                value={formik.values.year}
                onChange={formik.handleChange}
                error={formik.touched.year && Boolean(formik.errors.year)}
                helperText={formik.touched.year && formik.errors.year}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                  <MenuItem value="out_of_service">Out of Service</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="mileage"
                label="Mileage (km)"
                type="number"
                value={formik.values.mileage}
                onChange={formik.handleChange}
                error={formik.touched.mileage && Boolean(formik.errors.mileage)}
                helperText={formik.touched.mileage && formik.errors.mileage}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Fuel Type</InputLabel>
                <Select
                  name="fuelType"
                  value={formik.values.fuelType}
                  onChange={formik.handleChange}
                  label="Fuel Type"
                >
                  <MenuItem value="petrol">Petrol</MenuItem>
                  <MenuItem value="diesel">Diesel</MenuItem>
                  <MenuItem value="electric">Electric</MenuItem>
                  <MenuItem value="hybrid">Hybrid</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="insuranceNumber"
                label="Insurance Number"
                value={formik.values.insuranceNumber}
                onChange={formik.handleChange}
                error={
                  formik.touched.insuranceNumber &&
                  Boolean(formik.errors.insuranceNumber)
                }
                helperText={
                  formik.touched.insuranceNumber &&
                  formik.errors.insuranceNumber
                }
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                name="lastService"
                label="Last Service Date"
                type="date"
                value={formik.values.lastService}
                onChange={formik.handleChange}
                error={
                  formik.touched.lastService &&
                  Boolean(formik.errors.lastService)
                }
                helperText={
                  formik.touched.lastService && formik.errors.lastService
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                name="nextServiceDue"
                label="Next Service Due"
                type="date"
                value={formik.values.nextServiceDue}
                onChange={formik.handleChange}
                error={
                  formik.touched.nextServiceDue &&
                  Boolean(formik.errors.nextServiceDue)
                }
                helperText={
                  formik.touched.nextServiceDue && formik.errors.nextServiceDue
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                name="insuranceExpiry"
                label="Insurance Expiry"
                type="date"
                value={formik.values.insuranceExpiry}
                onChange={formik.handleChange}
                error={
                  formik.touched.insuranceExpiry &&
                  Boolean(formik.errors.insuranceExpiry)
                }
                helperText={
                  formik.touched.insuranceExpiry &&
                  formik.errors.insuranceExpiry
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
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
          <Button type="submit" variant="contained">
            {isEdit ? 'Save Changes' : 'Add Vehicle'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default VehicleForm;
