import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  InputAdornment
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Build as MaintenanceIcon,
  Info as InfoIcon,
  CheckCircle as CompletedIcon,
  PendingOutlined as PendingIcon,
  ErrorOutline as FailedIcon,
  Visibility as VisibilityIcon,
  Build as BuildIcon,
  ReportProblem as ReportProblemIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchFleetVehicles, 
  addVehicle, 
  updateVehicleStatus, 
  scheduleMaintenance,
  setSelectedVehicle,
  addTrafficFine
} from '../store/slices/fleetSlice.js';

const FleetManagement = () => {
  const dispatch = useDispatch();
  const { vehicles, status, error, selectedVehicle } = useSelector((state) => state.fleet);
  
  // Modal states
  const [addVehicleModalOpen, setAddVehicleModalOpen] = useState(false);
  const [maintenanceModalOpen, setMaintenanceModalOpen] = useState(false);
  const [vehicleDetailsOpen, setVehicleDetailsOpen] = useState(false);
  const [maintenanceRecordOpen, setMaintenanceRecordOpen] = useState(false);
  const [selectedMaintenanceRecord, setSelectedMaintenanceRecord] = useState(null);
  const [selectedVehicleForMaintenance, setSelectedVehicleForMaintenance] = useState(null);
  const [trafficFineModalOpen, setTrafficFineModalOpen] = useState(false);
  const [fineDetailsModalOpen, setFineDetailsModalOpen] = useState(false);
  const [selectedFine, setSelectedFine] = useState(null);

  // Form states
  const [newVehicle, setNewVehicle] = useState({
    fleetNumber: '',
    registrationNumber: '',
    make: '',
    model: '',
    division: '',
    driver: '',
    licenseExpiryDate: '',
    yearAcquired: '',
    kmReadingOnDelivery: '',
    dateAssetDisposed: '',
    status: 'active',
    notes: ''
  });

  const [maintenanceDetails, setMaintenanceDetails] = useState({
    type: '',
    description: '',
    estimatedCost: ''
  });

  const [newFine, setNewFine] = useState({
    date: '',
    location: '',
    offence: '',
    amount: '',
    dueDate: '',
    driver: ''
  });

  useEffect(() => {
    dispatch(fetchFleetVehicles());
  }, [dispatch]);

  const handleAddVehicle = () => {
    dispatch(addVehicle(newVehicle));
    setAddVehicleModalOpen(false);
    setNewVehicle({
      fleetNumber: '',
      registrationNumber: '',
      make: '',
      model: '',
      division: '',
      driver: '',
      licenseExpiryDate: '',
      yearAcquired: '',
      kmReadingOnDelivery: '',
      dateAssetDisposed: '',
      status: 'active',
      notes: ''
    });
  };

  const handleScheduleMaintenance = () => {
    if (selectedVehicleForMaintenance) {
      dispatch(scheduleMaintenance({
        vehicleId: selectedVehicleForMaintenance.id,
        maintenanceDetails
      }));
      setMaintenanceModalOpen(false);
      setMaintenanceDetails({
        type: '',
        description: '',
        estimatedCost: ''
      });
    }
  };

  const handleVehicleDetails = (vehicle) => {
    dispatch(setSelectedVehicle(vehicle));
    setVehicleDetailsOpen(true);
  };

  const handleMaintenanceRecordOpen = (record) => {
    setSelectedMaintenanceRecord(record);
    setMaintenanceRecordOpen(true);
  };

  const handleAddTrafficFine = () => {
    dispatch(addTrafficFine({
      vehicleId: selectedVehicleForMaintenance.id,
      fineData: newFine
    }));
    setTrafficFineModalOpen(false);
    setNewFine({
      date: '',
      location: '',
      offence: '',
      amount: '',
      dueDate: '',
      driver: ''
    });
  };

  const handleViewFines = (vehicle) => {
    setSelectedVehicleForMaintenance(vehicle);
    setFineDetailsModalOpen(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CompletedIcon color="success" />;
      case 'In Progress':
        return <PendingIcon color="warning" />;
      case 'Failed':
        return <FailedIcon color="error" />;
      default:
        return null;
    }
  };

  const renderMaintenanceRecordModal = () => (
    <Dialog 
      open={maintenanceRecordOpen} 
      onClose={() => setMaintenanceRecordOpen(false)}
      maxWidth="md"
      fullWidth
    >
      {selectedMaintenanceRecord && (
        <>
          <DialogTitle>Maintenance Record Details</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6">Basic Information</Typography>
                <Typography>Date: {selectedMaintenanceRecord.date}</Typography>
                <Typography>Type: {selectedMaintenanceRecord.type}</Typography>
                <Typography>Technician: {selectedMaintenanceRecord.technician}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6">Financial Details</Typography>
                <Typography>Cost: ${selectedMaintenanceRecord.cost.toFixed(2)}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Description</Typography>
                <Typography>{selectedMaintenanceRecord.description}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Status</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {getStatusIcon(selectedMaintenanceRecord.status)}
                  <Chip 
                    label={selectedMaintenanceRecord.status} 
                    color={
                      selectedMaintenanceRecord.status === 'Completed' ? 'success' :
                      selectedMaintenanceRecord.status === 'In Progress' ? 'warning' : 'error'
                    } 
                  />
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setMaintenanceRecordOpen(false)}>Close</Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );

  const renderVehicleDetailsModal = () => {
    return (
      <Dialog 
        open={vehicleDetailsOpen} 
        onClose={() => setVehicleDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Vehicle Details: {selectedVehicle?.fleetNumber}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">Vehicle Information</Typography>
              <Typography>Type: {selectedVehicle?.type}</Typography>
              <Typography>Model: {selectedVehicle?.model}</Typography>
              <Typography>Status: {selectedVehicle?.status}</Typography>
              <Typography>Current Mileage: {selectedVehicle?.currentMileage} km</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">Maintenance History</Typography>
              {selectedVehicle?.maintenanceHistory.map((maintenance) => (
                <Paper 
                  key={maintenance.id} 
                  sx={{ 
                    p: 2, 
                    mb: 1, 
                    cursor: 'pointer',
                    '&:hover': { 
                      backgroundColor: 'rgba(0,0,0,0.05)' 
                    }
                  }}
                  onClick={() => handleMaintenanceRecordOpen(maintenance)}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography>{maintenance.date}</Typography>
                    <Chip 
                      label={maintenance.type} 
                      size="small" 
                      color={
                        maintenance.status === 'Completed' ? 'success' :
                        maintenance.status === 'In Progress' ? 'warning' : 'error'
                      } 
                    />
                  </Box>
                </Paper>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVehicleDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  };

  const renderAddVehicleModal = () => {
    return (
      <Dialog open={addVehicleModalOpen} onClose={() => setAddVehicleModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Vehicle</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fleet Number"
                name="fleetNumber"
                value={newVehicle.fleetNumber || ''}
                onChange={(e) => setNewVehicle({...newVehicle, fleetNumber: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Registration Number"
                name="registrationNumber"
                value={newVehicle.registrationNumber || ''}
                onChange={(e) => setNewVehicle({...newVehicle, registrationNumber: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Make"
                name="make"
                value={newVehicle.make || ''}
                onChange={(e) => setNewVehicle({...newVehicle, make: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Model"
                name="model"
                value={newVehicle.model || ''}
                onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Division"
                name="division"
                value={newVehicle.division || ''}
                onChange={(e) => setNewVehicle({...newVehicle, division: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Driver"
                name="driver"
                value={newVehicle.driver || ''}
                onChange={(e) => setNewVehicle({...newVehicle, driver: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="License Expiry Date"
                name="licenseExpiryDate"
                value={newVehicle.licenseExpiryDate || ''}
                onChange={(e) => setNewVehicle({...newVehicle, licenseExpiryDate: e.target.value})}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Year Acquired"
                name="yearAcquired"
                value={newVehicle.yearAcquired || ''}
                onChange={(e) => setNewVehicle({...newVehicle, yearAcquired: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="KM Reading on Delivery"
                name="kmReadingOnDelivery"
                value={newVehicle.kmReadingOnDelivery || ''}
                onChange={(e) => setNewVehicle({...newVehicle, kmReadingOnDelivery: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Date Asset Disposed"
                name="dateAssetDisposed"
                value={newVehicle.dateAssetDisposed || ''}
                onChange={(e) => setNewVehicle({...newVehicle, dateAssetDisposed: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={newVehicle.status || ''}
                  onChange={(e) => setNewVehicle({...newVehicle, status: e.target.value})}
                  label="Status"
                  required
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                  <MenuItem value="retired">Retired</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Notes"
                name="notes"
                value={newVehicle.notes || ''}
                onChange={(e) => setNewVehicle({...newVehicle, notes: e.target.value})}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddVehicleModalOpen(false)}>Cancel</Button>
          <Button onClick={handleAddVehicle} variant="contained" color="primary">
            Add Vehicle
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const renderTrafficFineModal = () => {
    return (
      <Dialog open={trafficFineModalOpen} onClose={() => setTrafficFineModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add Traffic Fine</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Vehicle</InputLabel>
                <Select
                  value={selectedVehicleForMaintenance ? selectedVehicleForMaintenance.id : ''}
                  onChange={(e) => {
                    const vehicle = vehicles.find(v => v.id === e.target.value);
                    setSelectedVehicleForMaintenance(vehicle);
                  }}
                  label="Vehicle"
                  required
                >
                  {vehicles.map((vehicle) => (
                    <MenuItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.fleetNumber} - {vehicle.registrationNumber}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Fine Date"
                value={newFine.date}
                onChange={(e) => setNewFine({...newFine, date: e.target.value})}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                value={newFine.location}
                onChange={(e) => setNewFine({...newFine, location: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Offence"
                value={newFine.offence}
                onChange={(e) => setNewFine({...newFine, offence: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Amount"
                value={newFine.amount}
                onChange={(e) => setNewFine({...newFine, amount: e.target.value})}
                InputProps={{
                  startAdornment: <InputAdornment position="start">R</InputAdornment>,
                }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Due Date"
                value={newFine.dueDate}
                onChange={(e) => setNewFine({...newFine, dueDate: e.target.value})}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Driver"
                value={newFine.driver}
                onChange={(e) => setNewFine({...newFine, driver: e.target.value})}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTrafficFineModalOpen(false)}>Cancel</Button>
          <Button onClick={handleAddTrafficFine} variant="contained" color="primary">
            Add Fine
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const renderFineDetailsModal = () => {
    return (
      <Dialog open={fineDetailsModalOpen} onClose={() => setFineDetailsModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Traffic Fines - {selectedVehicleForMaintenance?.fleetNumber} ({selectedVehicleForMaintenance?.registrationNumber})
        </DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Offence</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Driver</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedVehicleForMaintenance?.trafficFines?.map((fine) => (
                  <TableRow key={fine.id}>
                    <TableCell>{fine.date}</TableCell>
                    <TableCell>{fine.offence}</TableCell>
                    <TableCell>{fine.location}</TableCell>
                    <TableCell>R {fine.amount.toFixed(2)}</TableCell>
                    <TableCell>{fine.dueDate}</TableCell>
                    <TableCell>
                      <Chip 
                        label={fine.status} 
                        color={fine.status === 'unpaid' ? 'error' : 'success'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{fine.driver}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFineDetailsModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Fleet Management</Typography>
      
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="primary">
              Total Vehicles
            </Typography>
            <Typography variant="h3">{vehicles.length}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="success.main">
              Active Vehicles
            </Typography>
            <Typography variant="h3">
              {vehicles.filter((v) => v.status === 'Active').length}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="warning.main">
              In Maintenance
            </Typography>
            <Typography variant="h3">
              {vehicles.filter((v) => v.status === 'In Maintenance').length}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mb: 2 }}>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => setAddVehicleModalOpen(true)}
          sx={{ mr: 2 }}
        >
          Add Vehicle
        </Button>
        <Button
          variant="contained"
          startIcon={<ReportProblemIcon />}
          onClick={() => setTrafficFineModalOpen(true)}
          color="warning"
        >
          Traffic Fines
        </Button>
      </Box>

      {/* Vehicle Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Vehicle Number</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow 
                key={vehicle.id} 
                hover 
                onClick={() => handleVehicleDetails(vehicle)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{vehicle.vehicleNumber}</TableCell>
                <TableCell>{vehicle.type}</TableCell>
                <TableCell>{vehicle.model}</TableCell>
                <TableCell>{vehicle.status}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      size="small"
                      startIcon={<InfoIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVehicleDetails(vehicle);
                      }}
                    >
                      Details
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="secondary" 
                      size="small"
                      startIcon={<MaintenanceIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVehicleForMaintenance(vehicle);
                        setMaintenanceModalOpen(true);
                      }}
                    >
                      Maintenance
                    </Button>
                    {vehicle.trafficFines?.some(fine => fine.status === 'unpaid') && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<ReportProblemIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewFines(vehicle);
                        }}
                      >
                        Fines
                      </Button>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Vehicle Modal */}
      {renderAddVehicleModal()}

      {/* Schedule Maintenance Modal */}
      <Dialog 
        open={maintenanceModalOpen} 
        onClose={() => setMaintenanceModalOpen(false)}
      >
        <DialogTitle>Schedule Maintenance for {selectedVehicleForMaintenance?.vehicleNumber}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Maintenance Type</InputLabel>
            <Select
              value={maintenanceDetails.type}
              label="Maintenance Type"
              onChange={(e) => setMaintenanceDetails({...maintenanceDetails, type: e.target.value})}
            >
              <MenuItem value="Routine Inspection">Routine Inspection</MenuItem>
              <MenuItem value="Repair">Repair</MenuItem>
              <MenuItem value="Major Service">Major Service</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={maintenanceDetails.description}
            onChange={(e) => setMaintenanceDetails({...maintenanceDetails, description: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Estimated Cost"
            type="number"
            fullWidth
            value={maintenanceDetails.estimatedCost}
            onChange={(e) => setMaintenanceDetails({...maintenanceDetails, estimatedCost: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMaintenanceModalOpen(false)}>Cancel</Button>
          <Button onClick={handleScheduleMaintenance} color="primary">Schedule</Button>
        </DialogActions>
      </Dialog>

      {/* Add Traffic Fine Modal */}
      {renderTrafficFineModal()}

      {/* Fine Details Modal */}
      {renderFineDetailsModal()}

      {/* Maintenance Record Modal */}
      {renderMaintenanceRecordModal()}

      {/* Vehicle Details Modal */}
      {renderVehicleDetailsModal()}
    </Box>
  );
};

export default FleetManagement;
