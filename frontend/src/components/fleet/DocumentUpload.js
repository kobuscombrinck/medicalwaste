import React, { useState } from 'react';
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
  Box,
  Typography,
  LinearProgress,
} from '@mui/material';
import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { addDocument } from '../../store/slices/vehicleSlice';

const validationSchema = yup.object({
  title: yup.string().required('Title is required'),
  type: yup.string().required('Document type is required'),
  expiryDate: yup.date(),
  notes: yup.string(),
  file: yup.mixed().required('File is required'),
});

const DocumentUpload = ({ vehicleId, onClose }) => {
  const dispatch = useDispatch();
  const [uploadProgress, setUploadProgress] = useState(0);

  const formik = useFormik({
    initialValues: {
      title: '',
      type: '',
      expiryDate: '',
      notes: '',
      file: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('type', values.type);
      formData.append('expiryDate', values.expiryDate);
      formData.append('notes', values.notes);
      formData.append('file', values.file);

      try {
        await dispatch(
          addDocument({
            vehicleId,
            document: formData,
            onUploadProgress: (progressEvent) => {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(progress);
            },
          })
        );
        onClose();
      } catch (error) {
        console.error('Upload failed:', error);
      }
    },
  });

  const handleFileChange = (event) => {
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      formik.setFieldValue('file', event.currentTarget.files[0]);
    }
  };

  return (
    <>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        Upload Document
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="title"
                label="Document Title"
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Document Type</InputLabel>
                <Select
                  name="type"
                  value={formik.values.type}
                  onChange={formik.handleChange}
                  label="Document Type"
                >
                  <MenuItem value="invoice">Invoice</MenuItem>
                  <MenuItem value="license">License</MenuItem>
                  <MenuItem value="insurance">Insurance</MenuItem>
                  <MenuItem value="registration">Registration</MenuItem>
                  <MenuItem value="maintenance">Maintenance Record</MenuItem>
                  <MenuItem value="fine">Traffic Fine</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="expiryDate"
                label="Expiry Date (if applicable)"
                type="date"
                value={formik.values.expiryDate}
                onChange={formik.handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="notes"
                label="Notes"
                multiline
                rows={3}
                value={formik.values.notes}
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  border: '2px dashed',
                  borderColor: 'primary.main',
                  borderRadius: 1,
                  p: 2,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
                component="label"
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <CloudUploadIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {formik.values.file
                    ? formik.values.file.name
                    : 'Click or drag file to upload'}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Supported formats: PDF, DOC, DOCX, JPG, PNG
                </Typography>
              </Box>
              {formik.touched.file && formik.errors.file && (
                <Typography color="error" variant="caption">
                  {formik.errors.file}
                </Typography>
              )}
            </Grid>

            {uploadProgress > 0 && (
              <Grid item xs={12}>
                <Box sx={{ width: '100%' }}>
                  <LinearProgress variant="determinate" value={uploadProgress} />
                  <Typography variant="body2" color="textSecondary">
                    Uploading: {uploadProgress}%
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={uploadProgress > 0 && uploadProgress < 100}
          >
            Upload
          </Button>
        </DialogActions>
      </form>
    </>
  );
};

export default DocumentUpload;
