import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  IconButton,
  Tabs,
  Tab,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  Avatar,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
  ColorLens as ThemeIcon,
  Person as PersonIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

// Mock user data
const userData = {
  name: 'John Smith',
  email: 'john.smith@company.com',
  role: 'Administrator',
  avatar: null,
  language: 'English',
  theme: 'light',
  notifications: {
    email: true,
    push: true,
    incidents: true,
    maintenance: true,
    system: false,
  },
};

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [settings, setSettings] = useState(userData);
  const [isEditing, setIsEditing] = useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSave = () => {
    setIsEditing(false);
    // TODO: Implement save functionality
  };

  const renderProfileSettings = () => (
    <Box sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
          <Avatar
            sx={{
              width: 120,
              height: 120,
              margin: '0 auto',
              mb: 2,
              bgcolor: 'primary.main',
            }}
          >
            {settings.name.charAt(0)}
          </Avatar>
          <Button variant="outlined" sx={{ mb: 2 }}>
            Change Avatar
          </Button>
        </Grid>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            label="Full Name"
            value={settings.name}
            disabled={!isEditing}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            value={settings.email}
            disabled={!isEditing}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={settings.role}
              label="Role"
              disabled={!isEditing}
            >
              <MenuItem value="Administrator">Administrator</MenuItem>
              <MenuItem value="Manager">Manager</MenuItem>
              <MenuItem value="Staff">Staff</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );

  const renderSystemSettings = () => (
    <Box sx={{ mt: 3 }}>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Language</InputLabel>
        <Select
          value={settings.language}
          label="Language"
          disabled={!isEditing}
        >
          <MenuItem value="English">English</MenuItem>
          <MenuItem value="Afrikaans">Afrikaans</MenuItem>
          <MenuItem value="Zulu">Zulu</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Theme</InputLabel>
        <Select
          value={settings.theme}
          label="Theme"
          disabled={!isEditing}
        >
          <MenuItem value="light">Light</MenuItem>
          <MenuItem value="dark">Dark</MenuItem>
          <MenuItem value="system">System Default</MenuItem>
        </Select>
      </FormControl>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Data Management
      </Typography>
      <Button variant="outlined" color="primary" sx={{ mr: 2 }}>
        Export Data
      </Button>
      <Button variant="outlined" color="error">
        Clear Cache
      </Button>
    </Box>
  );

  const renderNotificationSettings = () => (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Notification Channels
      </Typography>
      <FormControlLabel
        control={
          <Switch
            checked={settings.notifications.email}
            disabled={!isEditing}
          />
        }
        label="Email Notifications"
        sx={{ mb: 2, display: 'block' }}
      />
      <FormControlLabel
        control={
          <Switch
            checked={settings.notifications.push}
            disabled={!isEditing}
          />
        }
        label="Push Notifications"
        sx={{ mb: 2, display: 'block' }}
      />
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" gutterBottom>
        Notification Types
      </Typography>
      <FormControlLabel
        control={
          <Switch
            checked={settings.notifications.incidents}
            disabled={!isEditing}
          />
        }
        label="Incident Reports"
        sx={{ mb: 2, display: 'block' }}
      />
      <FormControlLabel
        control={
          <Switch
            checked={settings.notifications.maintenance}
            disabled={!isEditing}
          />
        }
        label="Maintenance Updates"
        sx={{ mb: 2, display: 'block' }}
      />
      <FormControlLabel
        control={
          <Switch
            checked={settings.notifications.system}
            disabled={!isEditing}
          />
        }
        label="System Updates"
        sx={{ mb: 2, display: 'block' }}
      />
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/dashboard')} sx={{ p: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            Settings
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            variant={isEditing ? 'contained' : 'outlined'}
            startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            {isEditing ? 'Save Changes' : 'Edit Settings'}
          </Button>
        </Box>

        {/* Settings Content */}
        <Paper sx={{ p: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab
              icon={<PersonIcon />}
              label="Profile"
              iconPosition="start"
            />
            <Tab
              icon={<LanguageIcon />}
              label="System"
              iconPosition="start"
            />
            <Tab
              icon={<NotificationsIcon />}
              label="Notifications"
              iconPosition="start"
            />
          </Tabs>

          {activeTab === 0 && renderProfileSettings()}
          {activeTab === 1 && renderSystemSettings()}
          {activeTab === 2 && renderNotificationSettings()}
        </Paper>
      </Container>
    </Box>
  );
};

export default Settings;
