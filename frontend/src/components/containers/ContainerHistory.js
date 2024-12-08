import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import {
  Close as CloseIcon,
  LocalShipping as DeliveryIcon,
  Person as CustomerIcon,
  Build as MaintenanceIcon,
  Cleaning as CleaningIcon,
  Warning as IncidentIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { selectContainerHistory, selectHistoryLoading } from '../../store/slices/containerSlice';

const getEventIcon = (eventType) => {
  switch (eventType) {
    case 'delivery':
      return <DeliveryIcon />;
    case 'customer_assignment':
      return <CustomerIcon />;
    case 'maintenance':
      return <MaintenanceIcon />;
    case 'cleaning':
      return <CleaningIcon />;
    case 'incident':
      return <IncidentIcon color="error" />;
    default:
      return null;
  }
};

const getEventColor = (eventType) => {
  switch (eventType) {
    case 'delivery':
      return 'primary';
    case 'customer_assignment':
      return 'secondary';
    case 'maintenance':
      return 'warning';
    case 'cleaning':
      return 'info';
    case 'incident':
      return 'error';
    default:
      return 'grey';
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const ContainerHistory = ({ open, onClose, containerId }) => {
  const history = useSelector(selectContainerHistory);
  const loading = useSelector(selectHistoryLoading);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Container History</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <Timeline position="alternate">
            {history.map((event, index) => (
              <TimelineItem key={event.id}>
                <TimelineOppositeContent color="text.secondary">
                  {formatDate(event.timestamp)}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color={getEventColor(event.type)}>
                    {getEventIcon(event.type)}
                  </TimelineDot>
                  {index < history.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  <Paper elevation={3} sx={{ p: 2 }}>
                    <Typography variant="h6" component="h3">
                      {event.title}
                    </Typography>
                    <Typography>{event.description}</Typography>
                    {event.location && (
                      <Typography variant="body2" color="text.secondary">
                        Location: {event.location}
                      </Typography>
                    )}
                    {event.performedBy && (
                      <Typography variant="body2" color="text.secondary">
                        By: {event.performedBy}
                      </Typography>
                    )}
                  </Paper>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ContainerHistory;
