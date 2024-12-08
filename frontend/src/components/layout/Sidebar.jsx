import React from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Toolbar 
} from '@mui/material';
import { 
  Dashboard as DashboardIcon, 
  LocalShipping as FleetIcon, 
  People as StaffIcon, 
  Delete as WasteIcon, 
  Build as MaintenanceIcon, 
  Report as IncidentIcon, 
  Settings as SettingsIcon 
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const drawerWidth = 240;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getUser } = useAuth();
  const user = getUser();

  const menuItems = [
    { 
      text: 'Dashboard', 
      icon: <DashboardIcon />, 
      path: '/dashboard' 
    },
    { 
      text: 'Fleet Management', 
      icon: <FleetIcon />, 
      path: '/fleet-management',
      roles: ['Administrator', 'Manager'] 
    },
    { 
      text: 'Staff Management', 
      icon: <StaffIcon />, 
      path: '/staff-management',
      roles: ['Administrator', 'Manager'] 
    },
    { 
      text: 'Waste Collection', 
      icon: <WasteIcon />, 
      path: '/waste-collection',
      roles: ['Administrator', 'Manager', 'Driver'] 
    },
    { 
      text: 'Maintenance', 
      icon: <MaintenanceIcon />, 
      path: '/maintenance',
      roles: ['Administrator', 'Manager', 'Staff'] 
    },
    { 
      text: 'Incident Reports', 
      icon: <IncidentIcon />, 
      path: '/incident-reports',
      roles: ['Administrator', 'Manager', 'Driver', 'Staff'] 
    },
    { 
      text: 'Settings', 
      icon: <SettingsIcon />, 
      path: '/settings',
      roles: ['Administrator'] 
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => 
    item.roles ? item.roles.includes(user?.role) : true
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: 'background.paper',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)'
        }
      }}
    >
      <Toolbar />
      <List>
        {filteredMenuItems.map((item) => (
          <ListItem 
            key={item.text}
            button 
            onClick={() => handleNavigation(item.path)}
            selected={location.pathname === item.path}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'primary.light',
                color: 'primary.contrastText',
                '& .MuiListItemIcon-root': {
                  color: 'primary.contrastText'
                }
              }
            }}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
