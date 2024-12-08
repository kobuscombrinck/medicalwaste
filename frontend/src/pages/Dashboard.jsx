import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CardActionArea,
} from '@mui/material';
import {
  DirectionsCar as FleetIcon,
  People as StaffIcon,
  Delete as WasteIcon,
  Build as MaintenanceIcon,
  Report as IncidentIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

const modules = [
  {
    title: 'Fleet Management',
    icon: <FleetIcon sx={{ fontSize: 40 }} />,
    description: 'Manage and track your vehicle fleet',
    path: '/fleet-management',
    color: '#2196F3',
  },
  {
    title: 'Staff Management',
    icon: <StaffIcon sx={{ fontSize: 40 }} />,
    description: 'Manage drivers and staff members',
    path: '/staff-management',
    color: '#4CAF50',
  },
  {
    title: 'Waste Collection',
    icon: <WasteIcon sx={{ fontSize: 40 }} />,
    description: 'Schedule and track waste collection',
    path: '/waste-collection',
    color: '#FF9800',
  },
  {
    title: 'Maintenance',
    icon: <MaintenanceIcon sx={{ fontSize: 40 }} />,
    description: 'Vehicle maintenance and repairs',
    path: '/maintenance',
    color: '#F44336',
  },
  {
    title: 'Incident Reports',
    icon: <IncidentIcon sx={{ fontSize: 40 }} />,
    description: 'Report and track incidents',
    path: '/incident-reports',
    color: '#9C27B0',
  },
  {
    title: 'Settings',
    icon: <SettingsIcon sx={{ fontSize: 40 }} />,
    description: 'System settings and configuration',
    path: '/settings',
    color: '#607D8B',
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ py: 4, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Grid container spacing={3}>
          {modules.map((module) => (
            <Grid item xs={12} sm={6} md={4} key={module.title}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <CardActionArea 
                  onClick={() => navigate(module.path)}
                  sx={{ height: '100%' }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Box sx={{ color: module.color, mb: 2 }}>
                      {module.icon}
                    </Box>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {module.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {module.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
