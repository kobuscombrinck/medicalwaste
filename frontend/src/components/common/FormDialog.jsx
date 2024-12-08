import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from './LoadingButton';

const FormDialog = ({
  open,
  onClose,
  onSubmit,
  title,
  submitText = 'Submit',
  cancelText = 'Cancel',
  loading = false,
  disabled = false,
  maxWidth = 'sm',
  fullScreen = false,
  children,
  submitButtonProps = {},
  cancelButtonProps = {},
}) => {
  const theme = useTheme();
  const fullScreenOnMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(event);
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth={maxWidth}
      fullWidth
      fullScreen={fullScreen || fullScreenOnMobile}
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit,
      }}
    >
      {/* Dialog Header */}
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h6" component="div">
          {title}
        </Typography>
        {onClose && (
          <IconButton
            aria-label="close"
            onClick={onClose}
            disabled={loading}
            sx={{
              color: theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>

      {/* Dialog Content */}
      <DialogContent
        sx={{
          p: 2,
          '&:first-of-type': {
            pt: 2,
          },
        }}
      >
        {children}
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Button
          onClick={onClose}
          disabled={loading}
          {...cancelButtonProps}
        >
          {cancelText}
        </Button>
        <LoadingButton
          type="submit"
          variant="contained"
          loading={loading}
          disabled={disabled}
          {...submitButtonProps}
        >
          {submitText}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default FormDialog;
