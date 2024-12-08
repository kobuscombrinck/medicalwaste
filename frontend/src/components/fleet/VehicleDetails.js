import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Warning as WarningIcon,
  Description as DocumentIcon,
  Build as MaintenanceIcon,
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import IncidentForm from './IncidentForm';
import DocumentUpload from './DocumentUpload';
import { deleteDocument, deleteIncident } from '../../store/slices/vehicleSlice';
import { showConfirmDialog } from '../../store/slices/uiSlice';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vehicle-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const VehicleDetails = ({ vehicle, onClose }) => {
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);
  const [incidentFormOpen, setIncidentFormOpen] = useState(false);
  const [documentUploadOpen, setDocumentUploadOpen] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDeleteIncident = (incident) => {
    dispatch(
      showConfirmDialog({
        title: 'Delete Incident',
        message: 'Are you sure you want to delete this incident?',
        onConfirm: () => dispatch(deleteIncident({ vehicleId: vehicle._id, incidentId: incident._id })),
      })
    );
  };

  const handleDeleteDocument = (document) => {
    dispatch(
      showConfirmDialog({
        title: 'Delete Document',
        message: 'Are you sure you want to delete this document?',
        onConfirm: () => dispatch(deleteDocument({ vehicleId: vehicle._id, documentId: document._id })),
      })
    );
  };

  const handleDownloadDocument = (document) => {
    window.open(document.fileUrl, '_blank');
  };

  const getIncidentTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'accident':
        return <WarningIcon color="error" />;
      case 'maintenance':
        return <MaintenanceIcon color="warning" />;
      default:
        return <WarningIcon />;
    }
  };

  return (
    <>
      <Box sx={{ position: 'relative' }}>
        <IconButton
          sx={{ position: 'absolute', right: 8, top: 8 }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>

        <Box sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            {vehicle.registrationNumber}
          </Typography>
          <Typography color="text.secondary">
            {vehicle.make} {vehicle.model} ({vehicle.year})
          </Typography>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2">Status</Typography>
              <Chip
                label={vehicle.status}
                color={vehicle.status === 'active' ? 'success' : 'warning'}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2">Mileage</Typography>
              <Typography>{vehicle.mileage} km</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2">Last Service</Typography>
              <Typography>
                {new Date(vehicle.lastService).toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2">Next Service Due</Typography>
              <Typography>
                {new Date(vehicle.nextServiceDue).toLocaleDateString()}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Incidents & Accidents" />
            <Tab label="Documents" />
            <Tab label="Maintenance History" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIncidentFormOpen(true)}
            >
              Add Incident
            </Button>
          </Box>

          <List>
            {vehicle.incidents.map((incident) => (
              <React.Fragment key={incident._id}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getIncidentTypeIcon(incident.type)}
                        <Typography sx={{ ml: 1 }}>
                          {incident.type} - {new Date(incident.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                    }
                    secondary={incident.description}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteIncident(incident)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setDocumentUploadOpen(true)}
            >
              Add Document
            </Button>
          </Box>

          <List>
            {vehicle.documents.map((document) => (
              <React.Fragment key={document._id}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <DocumentIcon sx={{ mr: 1 }} />
                        {document.title}
                      </Box>
                    }
                    secondary={`Type: ${document.type} | Added: ${new Date(
                      document.dateAdded
                    ).toLocaleDateString()}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleDownloadDocument(document)}
                      sx={{ mr: 1 }}
                    >
                      <DownloadIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteDocument(document)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <List>
            {vehicle.maintenanceHistory.map((maintenance) => (
              <React.Fragment key={maintenance._id}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <MaintenanceIcon sx={{ mr: 1 }} />
                        {maintenance.type}
                      </Box>
                    }
                    secondary={`Date: ${new Date(
                      maintenance.date
                    ).toLocaleDateString()} | Cost: $${maintenance.cost}`}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {maintenance.notes}
                  </Typography>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </TabPanel>
      </Box>

      <Dialog
        open={incidentFormOpen}
        onClose={() => setIncidentFormOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <IncidentForm
          vehicleId={vehicle._id}
          onClose={() => setIncidentFormOpen(false)}
        />
      </Dialog>

      <Dialog
        open={documentUploadOpen}
        onClose={() => setDocumentUploadOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DocumentUpload
          vehicleId={vehicle._id}
          onClose={() => setDocumentUploadOpen(false)}
        />
      </Dialog>
    </>
  );
};

export default VehicleDetails;
