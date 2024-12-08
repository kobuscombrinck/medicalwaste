import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Chip,
  Dialog,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DirectionsCar as CarIcon,
  Description as DocumentIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchVehicles,
  selectVehicles,
  selectLoading,
} from '../store/slices/vehicleSlice';
import VehicleForm from '../components/fleet/VehicleForm';
import VehicleDetails from '../components/fleet/VehicleDetails';
import { showConfirmDialog } from '../store/slices/uiSlice';

const Fleet = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const vehicles = useSelector(selectVehicles);
  const loading = useSelector(selectLoading);

  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  useEffect(() => {
    dispatch(fetchVehicles());
  }, [dispatch]);

  const handleAddClick = () => {
    setSelectedVehicle(null);
    setFormOpen(true);
  };

  const handleEditClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setFormOpen(true);
  };

  const handleDeleteClick = (vehicle) => {
    dispatch(
      showConfirmDialog({
        title: 'Delete Vehicle',
        message: `Are you sure you want to delete ${vehicle.registrationNumber}?`,
        onConfirm: () => dispatch(deleteVehicle(vehicle._id)),
      })
    );
  };

  const handleVehicleClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setDetailsOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'maintenance':
        return 'warning';
      case 'out_of_service':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Fleet Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          Add Vehicle
        </Button>
      </Box>

      <Grid container spacing={3}>
        {vehicles.map((vehicle) => (
          <Grid item xs={12} sm={6} md={4} key={vehicle._id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: theme.shadows[4],
                },
              }}
              onClick={() => handleVehicleClick(vehicle)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CarIcon sx={{ mr: 1 }} />
                  <Typography variant="h6" component="div">
                    {vehicle.registrationNumber}
                  </Typography>
                </Box>

                <Typography color="text.secondary" gutterBottom>
                  {vehicle.make} {vehicle.model} ({vehicle.year})
                </Typography>

                <Box sx={{ mt: 2 }}>
                  <Chip
                    label={vehicle.status}
                    color={getStatusColor(vehicle.status)}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  {vehicle.incidents.length > 0 && (
                    <Chip
                      icon={<WarningIcon />}
                      label={`${vehicle.incidents.length} Incidents`}
                      color="warning"
                      size="small"
                      sx={{ mr: 1 }}
                    />
                  )}
                  {vehicle.documents.length > 0 && (
                    <Chip
                      icon={<DocumentIcon />}
                      label={`${vehicle.documents.length} Documents`}
                      color="info"
                      size="small"
                    />
                  )}
                </Box>
              </CardContent>
              <CardActions sx={{ mt: 'auto', justifyContent: 'flex-end' }}>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(vehicle);
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(vehicle);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <VehicleForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        vehicle={selectedVehicle}
      />

      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <VehicleDetails
          vehicle={selectedVehicle}
          onClose={() => setDetailsOpen(false)}
        />
      </Dialog>
    </Box>
  );
};

export default Fleet;
