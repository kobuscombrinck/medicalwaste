import { Button, CircularProgress } from '@mui/material';

const LoadingButton = ({
  loading = false,
  children,
  startIcon,
  loadingText = 'Please wait...',
  ...props
}) => {
  return (
    <Button
      {...props}
      disabled={loading || props.disabled}
      startIcon={
        loading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          startIcon
        )
      }
    >
      {loading ? loadingText : children}
    </Button>
  );
};

export default LoadingButton;
