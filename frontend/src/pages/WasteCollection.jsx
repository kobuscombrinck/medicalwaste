import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  LocalShipping as TruckIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';

// Mock data for waste collection schedules
const collections = [
  {
    id: 1,
    facility: 'City Hospital',
    address: '123 Medical Drive, Johannesburg',
    scheduledDate: '2023-10-20',
    scheduledTime: '09:00 AM',
    status: 'Scheduled',
    wasteType: 'Medical Waste',
    quantity: '250 kg',
    expectedWeight: '275 kg',
    assignedVehicle: 'MWV-001',
    driver: 'John Doe',
    route: 'Route A',
    truck: 'Truck 1'
  },
  {
    id: 2,
    facility: 'Central Clinic',
    address: '456 Health Street, Pretoria',
    scheduledDate: '2023-10-20',
    scheduledTime: '11:30 AM',
    status: 'In Progress',
    wasteType: 'Sharps',
    quantity: '100 kg',
    expectedWeight: '120 kg',
    assignedVehicle: 'MWV-002',
    driver: 'Jane Smith',
    route: 'Route B',
    truck: 'Truck 2'
  },
  {
    id: 3,
    facility: 'Medical Center',
    address: '789 Care Road, Sandton',
    scheduledDate: '2023-10-20',
    scheduledTime: '02:00 PM',
    status: 'Completed',
    wasteType: 'Biohazard',
    quantity: '175 kg',
    expectedWeight: '200 kg',
    assignedVehicle: 'MWV-003',
    driver: 'Mike Johnson',
    route: 'Route C',
    truck: 'Truck 3'
  },
];

const WasteCollection = () => {
  const navigate = useNavigate();
  const [weightModalOpen, setWeightModalOpen] = useState(false);
  const [weightViewMode, setWeightViewMode] = useState('facility');

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'in progress':
        return 'warning';
      case 'scheduled':
        return 'info';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTotalWeight = () => {
    return collections.reduce((total, collection) => {
      return total + parseInt(collection.quantity);
    }, 0);
  };

  const getTotalExpectedWeight = () => {
    return collections.reduce((total, collection) => {
      return total + parseInt(collection.expectedWeight);
    }, 0);
  };

  const getWeightBreakdown = () => {
    // Group by the selected view mode
    const groupedData = collections.reduce((acc, collection) => {
      let key;
      switch (weightViewMode) {
        case 'truck':
          key = collection.truck;
          break;
        case 'route':
          key = collection.route;
          break;
        default:
          key = collection.facility;
      }

      // Find or create group
      const existingGroup = acc.find(group => group.name === key);
      if (existingGroup) {
        existingGroup.quantity = (parseFloat(existingGroup.quantity || 0) + parseFloat(collection.quantity)).toFixed(2);
        existingGroup.expectedWeight = (parseFloat(existingGroup.expectedWeight || 0) + parseFloat(collection.expectedWeight)).toFixed(2);
      } else {
        acc.push({
          name: key,
          wasteType: collection.wasteType,
          quantity: collection.quantity,
          expectedWeight: collection.expectedWeight
        });
      }
      return acc;
    }, []);

    // Calculate percentages for grouped data
    return groupedData.map(group => {
      const actualWeight = parseFloat(group.quantity);
      const expectedWeight = parseFloat(group.expectedWeight);
      
      return {
        name: group.name,
        wasteType: group.wasteType,
        quantity: group.quantity,
        expectedWeight: group.expectedWeight,
        percentage: ((actualWeight / expectedWeight) * 100).toFixed(2)
      };
    });
  };

  const calculateTotals = () => {
    const breakdown = getWeightBreakdown();
    
    // Sum of actual and expected quantities
    const totalActualQuantity = breakdown.reduce((sum, item) => 
      sum + parseFloat(item.quantity), 0);
    
    const totalExpectedQuantity = breakdown.reduce((sum, item) => 
      sum + parseFloat(item.expectedWeight), 0);
    
    // Average of percentages
    const averageActualPercentage = breakdown.reduce((sum, item) => 
      sum + parseFloat(item.percentage), 0) / breakdown.length;

    return {
      totalActualQuantity,
      totalExpectedQuantity,
      averageActualPercentage: averageActualPercentage.toFixed(2)
    };
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/dashboard')} sx={{ p: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            Waste Collection
          </Typography>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="primary">
                Total Collections
              </Typography>
              <Typography variant="h3">{collections.length}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper 
              sx={{ 
                p: 3, 
                textAlign: 'center', 
                cursor: 'pointer', 
                '&:hover': { 
                  backgroundColor: 'rgba(0,0,0,0.05)' 
                } 
              }}
              onClick={() => setWeightModalOpen(true)}
            >
              <Typography variant="h6" color="success.main">
                Total Weight
              </Typography>
              <Typography variant="h3">{getTotalWeight()} kg</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="warning.main">
                In Progress
              </Typography>
              <Typography variant="h3">
                {collections.filter(c => c.status === 'In Progress').length}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Weight Breakdown Modal */}
        <Dialog
          open={weightModalOpen}
          onClose={() => setWeightModalOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h4" sx={{ fontWeight: 600, flex: 1 }}>
              Weight Breakdown
            </Typography>
            <FormControl variant="outlined" sx={{ minWidth: 200 }}>
              <InputLabel>Choose Option</InputLabel>
              <Select
                value={weightViewMode}
                onChange={(e) => setWeightViewMode(e.target.value)}
                label="Choose Option"
              >
                <MenuItem value="facility">Facility</MenuItem>
                <MenuItem value="truck">Truck</MenuItem>
                <MenuItem value="route">Route</MenuItem>
              </Select>
            </FormControl>
          </DialogTitle>
          <DialogContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{weightViewMode.charAt(0).toUpperCase() + weightViewMode.slice(1)}</TableCell>
                  <TableCell>Waste Type</TableCell>
                  <TableCell>Actual Quantity</TableCell>
                  <TableCell>Expected Quantity</TableCell>
                  <TableCell>Actual %</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getWeightBreakdown().map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.wasteType}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.expectedWeight}</TableCell>
                    <TableCell>{item.percentage}%</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={2}><strong>Total</strong></TableCell>
                  <TableCell><strong>{calculateTotals().totalActualQuantity.toFixed(2)} kg</strong></TableCell>
                  <TableCell><strong>{calculateTotals().totalExpectedQuantity.toFixed(2)} kg</strong></TableCell>
                  <TableCell><strong>{calculateTotals().averageActualPercentage}%</strong></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setWeightModalOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Action Buttons */}
        <Box sx={{ mb: 4 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ mr: 2 }}
            onClick={() => {/* Add collection handler */}}
          >
            Schedule Collection
          </Button>
          <Button
            variant="outlined"
            startIcon={<ScheduleIcon />}
            onClick={() => {/* View calendar handler */}}
          >
            View Calendar
          </Button>
        </Box>

        {/* Collections Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Facility</TableCell>
                <TableCell>Schedule</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Waste Details</TableCell>
                <TableCell>Vehicle & Driver</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {collections.map((collection) => (
                <TableRow key={collection.id}>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2">
                        {collection.facility}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                      >
                        <LocationIcon sx={{ fontSize: 16 }} />
                        {collection.address}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2">
                        {collection.scheduledDate}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {collection.scheduledTime}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={collection.status}
                      color={getStatusColor(collection.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2">
                        {collection.wasteType}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Quantity: {collection.quantity}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TruckIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="subtitle2">
                          {collection.assignedVehicle}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Driver: {collection.driver}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => {/* Edit handler */}}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {/* Delete handler */}}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
};

export default WasteCollection;
