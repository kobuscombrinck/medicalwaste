import React from 'react';
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
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Build as MaintenanceIcon,
  LocalShipping as TruckIcon,
  Engineering as TechnicianIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

// Mock data for maintenance records
const maintenanceRecords = [
  {
    id: 1,
    vehicleNumber: 'MWV-001',
    type: 'Scheduled Service',
    status: 'Pending',
    scheduledDate: '2023-10-25',
    description: 'Regular 15,000 km service',
    assignedTechnician: 'Jane Smith',
    estimatedCost: 'R 2,500',
    mileage: '14,850 km',
    priority: 'Medium',
  },
  {
    id: 2,
    vehicleNumber: 'MWV-002',
    type: 'Repair',
    status: 'In Progress',
    scheduledDate: '2023-10-20',
    description: 'Brake system maintenance',
    assignedTechnician: 'Mike Brown',
    estimatedCost: 'R 3,800',
    mileage: '22,450 km',
    priority: 'High',
  },
  {
    id: 3,
    vehicleNumber: 'MWV-003',
    type: 'Inspection',
    status: 'Completed',
    scheduledDate: '2023-10-18',
    description: 'Annual vehicle inspection',
    assignedTechnician: 'Sarah Wilson',
    estimatedCost: 'R 1,200',
    mileage: '18,200 km',
    priority: 'Low',
  },
];

const Maintenance = () => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'in progress':
        return 'warning';
      case 'pending':
        return 'info';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getMaintenanceProgress = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 100;
      case 'in progress':
        return 60;
      case 'pending':
        return 0;
      default:
        return 0;
    }
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
            Maintenance Management
          </Typography>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="primary">
                Total Tasks
              </Typography>
              <Typography variant="h3">{maintenanceRecords.length}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="error.main">
                High Priority
              </Typography>
              <Typography variant="h3">
                {maintenanceRecords.filter(r => r.priority === 'High').length}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="warning.main">
                In Progress
              </Typography>
              <Typography variant="h3">
                {maintenanceRecords.filter(r => r.status === 'In Progress').length}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="success.main">
                Completed
              </Typography>
              <Typography variant="h3">
                {maintenanceRecords.filter(r => r.status === 'Completed').length}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box sx={{ mb: 4 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ mr: 2 }}
            onClick={() => {/* Add maintenance record handler */}}
          >
            Schedule Maintenance
          </Button>
          <Button
            variant="outlined"
            startIcon={<WarningIcon />}
            color="error"
            onClick={() => {/* Report issue handler */}}
          >
            Report Issue
          </Button>
        </Box>

        {/* Maintenance Records Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Vehicle & Details</TableCell>
                <TableCell>Maintenance Info</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Technician</TableCell>
                <TableCell>Cost & Priority</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {maintenanceRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TruckIcon sx={{ color: 'primary.main' }} />
                      <Box>
                        <Typography variant="subtitle2">
                          {record.vehicleNumber}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Mileage: {record.mileage}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2">
                        {record.type}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {record.description}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Date: {record.scheduledDate}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ width: '100%', maxWidth: 150 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Chip
                          label={record.status}
                          color={getStatusColor(record.status)}
                          size="small"
                        />
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={getMaintenanceProgress(record.status)}
                        color={getStatusColor(record.status)}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TechnicianIcon sx={{ color: 'primary.main' }} />
                      <Typography variant="body2">
                        {record.assignedTechnician}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2">
                        {record.estimatedCost}
                      </Typography>
                      <Chip
                        label={record.priority}
                        color={getPriorityColor(record.priority)}
                        size="small"
                        sx={{ mt: 1 }}
                      />
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

export default Maintenance;
