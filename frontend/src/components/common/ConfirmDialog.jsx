import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'confirm', // 'confirm', 'warning', 'danger'
  loading = false,
  confirmButtonProps = {},
  cancelButtonProps = {},
}) => {
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <WarningIcon sx={{ color: 'warning.main', fontSize: 40 }} />;
      case 'danger':
        return <ErrorOutlineIcon sx={{ color: 'error.main', fontSize: 40 }} />;
      default:
        return <HelpOutlineIcon sx={{ color: 'info.main', fontSize: 40 }} />;
    }
  };

  const getConfirmButtonColor = () => {
    switch (type) {
      case 'warning':
        return 'warning';
      case 'danger':
        return 'error';
      default:
        return 'primary';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          pb: 0,
        }}
      >
        {getIcon()}
        <Typography variant="h6" component="span">
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          {...cancelButtonProps}
        >
          {cancelText}
        </Button>
        <Button
          variant="contained"
          color={getConfirmButtonColor()}
          onClick={onConfirm}
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} color="inherit" />}
          {...confirmButtonProps}
        >
          {loading ? 'Processing...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
