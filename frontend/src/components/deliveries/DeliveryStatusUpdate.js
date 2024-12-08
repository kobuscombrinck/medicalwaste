import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  status: yup.string().required('Status is required'),
  notes: yup.string(),
});

const deliveryStatuses = [
  { value: 'scheduled', label: 'Scheduled', step: 0 },
  { value: 'in_transit', label: 'In Transit', step: 1 },
  { value: 'arrived', label: 'Arrived at Location', step: 2 },
  { value: 'in_progress', label: 'In Progress', step: 3 },
  { value: 'completed', label: 'Completed', step: 4 },
  { value: 'cancelled', label: 'Cancelled', step: -1 },
];

const DeliveryStatusUpdate = ({ open, onClose, onSubmit, currentStatus }) => {
  const formik = useFormik({
    initialValues: {
      status: currentStatus || 'scheduled',
      notes: '',
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const getCurrentStep = () => {
    const status = deliveryStatuses.find(s => s.value === formik.values.status);
    return status ? status.step : 0;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Update Delivery Status</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Box sx={{ mb: 4 }}>
            <Stepper activeStep={getCurrentStep()} alternativeLabel>
              {deliveryStatuses
                .filter(status => status.step >= 0)
                .sort((a, b) => a.step - b.step)
                .map((status) => (
                  <Step key={status.value}>
                    <StepLabel>{status.label}</StepLabel>
                  </Step>
                ))}
            </Stepper>
          </Box>

          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>New Status</InputLabel>
              <Select
                name="status"
                value={formik.values.status}
                label="New Status"
                onChange={formik.handleChange}
              >
                {deliveryStatuses.map((status) => (
                  <MenuItem 
                    key={status.value} 
                    value={status.value}
                    disabled={status.step < getCurrentStep() && status.value !== 'cancelled'}
                  >
                    {status.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              id="notes"
              name="notes"
              label="Status Update Notes"
              multiline
              rows={4}
              value={formik.values.notes}
              onChange={formik.handleChange}
              placeholder="Enter any relevant notes about this status update..."
            />
          </Box>

          {formik.values.status === 'cancelled' && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              Warning: Cancelling a delivery cannot be undone. Please make sure this is the intended action.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            color={formik.values.status === 'cancelled' ? 'error' : 'primary'}
          >
            Update Status
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DeliveryStatusUpdate;
