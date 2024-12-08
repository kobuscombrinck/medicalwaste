import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Button,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalShipping as TruckIcon,
  Engineering as TechnicianIcon,
  SupervisorAccount as SupervisorIcon,
  ReportProblem as ReportProblemIcon,
} from '@mui/icons-material';
import { 
  selectDriverFines, 
  getDriverFines,
  selectStaff, 
  selectStaffStatus, 
  selectStaffError,
  addStaffMember 
} from '../store/slices/staffSlice';

const StaffManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const staff = useSelector(selectStaff);
  const status = useSelector(selectStaffStatus);
  const error = useSelector(selectStaffError);
  const driverFines = useSelector(selectDriverFines);
  
  const [driverFinesModalOpen, setDriverFinesModalOpen] = useState(false);
  const [addStaffModalOpen, setAddStaffModalOpen] = useState(false);
  const [selectedStaffMember, setSelectedStaffMember] = useState(null);
  const [newStaffMember, setNewStaffMember] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    address: '',
    idNumber: '',
    licenseNumber: '',
    licenseExpiry: ''
  });

  const getRoleIcon = (role) => {
    switch (role.toLowerCase()) {
      case 'driver':
        return <TruckIcon />;
      case 'technician':
        return <TechnicianIcon />;
      case 'supervisor':
        return <SupervisorIcon />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'on leave':
        return 'warning';
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatName = (name) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handleViewDriverFines = (staffMember) => {
    dispatch(getDriverFines(staffMember.name));
    setSelectedStaffMember(staffMember);
    setDriverFinesModalOpen(true);
  };

  const handleAddStaff = () => {
    dispatch(addStaffMember(newStaffMember));
    setAddStaffModalOpen(false);
    setNewStaffMember({
      name: '',
      role: '',
      email: '',
      phone: '',
      address: '',
      idNumber: '',
      licenseNumber: '',
      licenseExpiry: ''
    });
  };

  const renderDriverFinesModal = () => {
    return (
      <Dialog open={driverFinesModalOpen} onClose={() => setDriverFinesModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Traffic Fines - {selectedStaffMember?.name}
        </DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Vehicle</TableCell>
                  <TableCell>Offence</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {driverFines.map((fine) => (
                  <TableRow key={fine.id}>
                    <TableCell>{fine.date}</TableCell>
                    <TableCell>{fine.vehicleNumber}</TableCell>
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
                  </TableRow>
                ))}
                {driverFines.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No traffic fines found for this driver
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDriverFinesModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  };

  const renderAddStaffModal = () => {
    return (
      <Dialog open={addStaffModalOpen} onClose={() => setAddStaffModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add Staff Member</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={newStaffMember.name}
                onChange={(e) => setNewStaffMember({ ...newStaffMember, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Role</InputLabel>
                <Select
                  value={newStaffMember.role}
                  label="Role"
                  onChange={(e) => setNewStaffMember({ ...newStaffMember, role: e.target.value })}
                >
                  <MenuItem value="Driver">Driver</MenuItem>
                  <MenuItem value="Technician">Technician</MenuItem>
                  <MenuItem value="Supervisor">Supervisor</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newStaffMember.email}
                onChange={(e) => setNewStaffMember({ ...newStaffMember, email: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={newStaffMember.phone}
                onChange={(e) => setNewStaffMember({ ...newStaffMember, phone: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                multiline
                rows={2}
                value={newStaffMember.address}
                onChange={(e) => setNewStaffMember({ ...newStaffMember, address: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ID Number"
                value={newStaffMember.idNumber}
                onChange={(e) => setNewStaffMember({ ...newStaffMember, idNumber: e.target.value })}
                required
              />
            </Grid>
            {newStaffMember.role === 'Driver' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Driver's License Number"
                    value={newStaffMember.licenseNumber}
                    onChange={(e) => setNewStaffMember({ ...newStaffMember, licenseNumber: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="License Expiry Date"
                    type="date"
                    value={newStaffMember.licenseExpiry}
                    onChange={(e) => setNewStaffMember({ ...newStaffMember, licenseExpiry: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddStaffModalOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleAddStaff} 
            variant="contained" 
            color="primary"
            disabled={!newStaffMember.name || !newStaffMember.role || !newStaffMember.email || !newStaffMember.phone}
          >
            Add Staff Member
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            Staff Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setAddStaffModalOpen(true)}
          >
            Add Staff
          </Button>
        </Box>

        {/* Summary Cards */}
        <Box sx={{ mb: 4, display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="primary">Total Staff</Typography>
            <Typography variant="h3">{staff.length}</Typography>
          </Paper>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="success.main">Active Staff</Typography>
            <Typography variant="h3">
              {staff.filter(s => s.status.toLowerCase() === 'active').length}
            </Typography>
          </Paper>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="info.main">Drivers</Typography>
            <Typography variant="h3">
              {staff.filter(s => s.role.toLowerCase() === 'driver').length}
            </Typography>
          </Paper>
        </Box>

        {/* Staff Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {staff.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar>{member.name.charAt(0)}</Avatar>
                      <Typography>{formatName(member.name)}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getRoleIcon(member.role)}
                      <Typography>{member.role}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{member.contact}</TableCell>
                  <TableCell>
                    <Chip
                      label={member.status}
                      color={getStatusColor(member.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => {/* Edit handler */}}
                        color="primary"
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
                      {member.role.toLowerCase() === 'driver' && (
                        <IconButton
                          size="small"
                          onClick={() => handleViewDriverFines(member)}
                          color="warning"
                        >
                          <ReportProblemIcon />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add Staff Modal */}
        {renderAddStaffModal()}

        {/* Driver Fines Modal */}
        {renderDriverFinesModal()}
      </Container>
    </Box>
  );
};

export default StaffManagement;
