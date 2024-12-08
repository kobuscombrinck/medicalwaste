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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  LocalShipping as TruckIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';

// Mock data for incident reports
const incidents = [
  {
    id: 1,
    date: '2023-10-19',
    time: '09:30 AM',
    type: 'Vehicle Accident',
    severity: 'High',
    status: 'Under Investigation',
    location: '123 Main Road, Johannesburg',
    vehicleNumber: 'MWV-001',
    driver: 'John Doe',
    description: 'Minor collision with another vehicle during waste collection',
    actionTaken: 'Police report filed, vehicle sent for inspection',
  },
  {
    id: 2,
    date: '2023-10-18',
    time: '02:15 PM',
    type: 'Waste Spillage',
    severity: 'Medium',
    status: 'Resolved',
    location: '456 Health Street, Pretoria',
    vehicleNumber: 'MWV-002',
    driver: 'Jane Smith',
    description: 'Small medical waste spillage during loading',
    actionTaken: 'Area sanitized, safety protocols reviewed',
  },
  {
    id: 3,
    date: '2023-10-17',
    time: '11:45 AM',
    type: 'Equipment Failure',
    severity: 'Low',
    status: 'Pending Review',
    location: '789 Hospital Ave, Sandton',
    vehicleNumber: 'MWV-003',
    driver: 'Mike Johnson',
    description: 'Hydraulic lift malfunction during operation',
    actionTaken: 'Maintenance team notified, temporary equipment replacement',
  },
];

const IncidentReports = () => {
  const navigate = useNavigate();

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
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

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return 'success';
      case 'under investigation':
        return 'warning';
      case 'pending review':
        return 'info';
      default:
        return 'default';
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
            Incident Reports
          </Typography>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="primary">
                Total Incidents
              </Typography>
              <Typography variant="h3">{incidents.length}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="error.main">
                High Severity
              </Typography>
              <Typography variant="h3">
                {incidents.filter(i => i.severity === 'High').length}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="warning.main">
                Under Investigation
              </Typography>
              <Typography variant="h3">
                {incidents.filter(i => i.status === 'Under Investigation').length}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="success.main">
                Resolved
              </Typography>
              <Typography variant="h3">
                {incidents.filter(i => i.status === 'Resolved').length}
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
            onClick={() => {/* Add incident handler */}}
          >
            Report Incident
          </Button>
          <Button
            variant="outlined"
            startIcon={<DescriptionIcon />}
            onClick={() => {/* Generate report handler */}}
          >
            Generate Report
          </Button>
        </Box>

        {/* Incidents Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date & Time</TableCell>
                <TableCell>Incident Details</TableCell>
                <TableCell>Location & Vehicle</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action Taken</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {incidents.map((incident) => (
                <TableRow key={incident.id}>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2">
                        {incident.date}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {incident.time}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2">
                        {incident.type}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {incident.description}
                      </Typography>
                      <Chip
                        label={`Severity: ${incident.severity}`}
                        color={getSeverityColor(incident.severity)}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <LocationIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                        <Typography variant="body2">
                          {incident.location}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TruckIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                        <Typography variant="body2">
                          {incident.vehicleNumber}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                        <Typography variant="body2">
                          {incident.driver}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={incident.status}
                      color={getStatusColor(incident.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {incident.actionTaken}
                    </Typography>
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

export default IncidentReports;
