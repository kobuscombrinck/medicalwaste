import React from 'react';
import {
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
import { addIncident } from '../../store/slices/vehicleSlice';

const validationSchema = yup.object({
  type: yup.string().required('Incident type is required'),
  date: yup.date().required('Date is required'),
  location: yup.string().required('Location is required'),
  description: yup.string().required('Description is required'),
  driverName: yup.string().required('Driver name is required'),
  cost: yup.number().min(0, 'Cost must be positive'),
  thirdPartyInvolved: yup.boolean(),
  thirdPartyDetails: yup.string().when('thirdPartyInvolved', {
    is: true,
    then: yup.string().required('Third party details are required'),
  }),
  policeReport: yup.boolean(),
  policeReportNumber: yup.string().when('policeReport', {
    is: true,
    then: yup.string().required('Police report number is required'),
  }),
  insuranceClaim: yup.boolean(),
  insuranceClaimNumber: yup.string().when('insuranceClaim', {
    is: true,
    then: yup.string().required('Insurance claim number is required'),
  }),
});

const IncidentForm = ({ vehicleId, onClose }) => {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      type: '',
      date: new Date().toISOString().split('T')[0],
      location: '',
      description: '',
      driverName: '',
      cost: 0,
      thirdPartyInvolved: false,
      thirdPartyDetails: '',
      policeReport: false,
      policeReportNumber: '',
      insuranceClaim: false,
      insuranceClaimNumber: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      await dispatch(addIncident({ vehicleId, incident: values }));
      onClose();
    },
  });

  return (
    <>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        Report Incident
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
              <FormControl fullWidth>
                <InputLabel>Incident Type</InputLabel>
                <Select
                  name="type"
                  value={formik.values.type}
                  onChange={formik.handleChange}
                  label="Incident Type"
                >
                  <MenuItem value="accident">Accident</MenuItem>
                  <MenuItem value="breakdown">Breakdown</MenuItem>
                  <MenuItem value="maintenance">Maintenance Issue</MenuItem>
                  <MenuItem value="damage">Vehicle Damage</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="date"
                label="Date"
                type="date"
                value={formik.values.date}
                onChange={formik.handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="location"
                label="Location"
                value={formik.values.location}
                onChange={formik.handleChange}
                error={formik.touched.location && Boolean(formik.errors.location)}
                helperText={formik.touched.location && formik.errors.location}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="driverName"
                label="Driver Name"
                value={formik.values.driverName}
                onChange={formik.handleChange}
                error={
                  formik.touched.driverName && Boolean(formik.errors.driverName)
                }
                helperText={formik.touched.driverName && formik.errors.driverName}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="cost"
                label="Estimated Cost"
                type="number"
                value={formik.values.cost}
                onChange={formik.handleChange}
                error={formik.touched.cost && Boolean(formik.errors.cost)}
                helperText={formik.touched.cost && formik.errors.cost}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="description"
                label="Description"
                multiline
                rows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
                error={
                  formik.touched.description &&
                  Boolean(formik.errors.description)
                }
                helperText={
                  formik.touched.description && formik.errors.description
                }
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Third Party Involved</InputLabel>
                <Select
                  name="thirdPartyInvolved"
                  value={formik.values.thirdPartyInvolved}
                  onChange={formik.handleChange}
                  label="Third Party Involved"
                >
                  <MenuItem value={false}>No</MenuItem>
                  <MenuItem value={true}>Yes</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {formik.values.thirdPartyInvolved && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="thirdPartyDetails"
                  label="Third Party Details"
                  value={formik.values.thirdPartyDetails}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.thirdPartyDetails &&
                    Boolean(formik.errors.thirdPartyDetails)
                  }
                  helperText={
                    formik.touched.thirdPartyDetails &&
                    formik.errors.thirdPartyDetails
                  }
                />
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Police Report Filed</InputLabel>
                <Select
                  name="policeReport"
                  value={formik.values.policeReport}
                  onChange={formik.handleChange}
                  label="Police Report Filed"
                >
                  <MenuItem value={false}>No</MenuItem>
                  <MenuItem value={true}>Yes</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {formik.values.policeReport && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="policeReportNumber"
                  label="Police Report Number"
                  value={formik.values.policeReportNumber}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.policeReportNumber &&
                    Boolean(formik.errors.policeReportNumber)
                  }
                  helperText={
                    formik.touched.policeReportNumber &&
                    formik.errors.policeReportNumber
                  }
                />
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Insurance Claim Filed</InputLabel>
                <Select
                  name="insuranceClaim"
                  value={formik.values.insuranceClaim}
                  onChange={formik.handleChange}
                  label="Insurance Claim Filed"
                >
                  <MenuItem value={false}>No</MenuItem>
                  <MenuItem value={true}>Yes</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {formik.values.insuranceClaim && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="insuranceClaimNumber"
                  label="Insurance Claim Number"
                  value={formik.values.insuranceClaimNumber}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.insuranceClaimNumber &&
                    Boolean(formik.errors.insuranceClaimNumber)
                  }
                  helperText={
                    formik.touched.insuranceClaimNumber &&
                    formik.errors.insuranceClaimNumber
                  }
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Submit Report
          </Button>
        </DialogActions>
      </form>
    </>
  );
};

export default IncidentForm;
