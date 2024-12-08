import { useState, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { getErrorMessage } from '../utils/helpers';

export const useNotification = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);

  const showSuccess = useCallback((message) => {
    enqueueSnackbar(message, {
      variant: 'success',
      autoHideDuration: 3000,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      },
    });
  }, [enqueueSnackbar]);

  const showError = useCallback((error) => {
    const message = getErrorMessage(error);
    enqueueSnackbar(message, {
      variant: 'error',
      autoHideDuration: 5000,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      },
    });
  }, [enqueueSnackbar]);

  const showWarning = useCallback((message) => {
    enqueueSnackbar(message, {
      variant: 'warning',
      autoHideDuration: 4000,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      },
    });
  }, [enqueueSnackbar]);

  const showInfo = useCallback((message) => {
    enqueueSnackbar(message, {
      variant: 'info',
      autoHideDuration: 3000,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      },
    });
  }, [enqueueSnackbar]);

  const withLoading = useCallback(async (promise, options = {}) => {
    const {
      successMessage,
      errorMessage,
      showSuccessNotification = true,
      showErrorNotification = true,
    } = options;

    setIsLoading(true);
    try {
      const result = await promise;
      if (showSuccessNotification) {
        showSuccess(successMessage || 'Operation completed successfully');
      }
      return result;
    } catch (error) {
      if (showErrorNotification) {
        showError(errorMessage || error);
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [showSuccess, showError]);

  const confirmAction = useCallback((message, action) => {
    const key = enqueueSnackbar(message, {
      variant: 'warning',
      persist: true,
      action: (snackbarKey) => (
        <>
          <Button
            color="inherit"
            size="small"
            onClick={() => {
              closeSnackbar(snackbarKey);
              action();
            }}
          >
            Confirm
          </Button>
          <Button
            color="inherit"
            size="small"
            onClick={() => closeSnackbar(snackbarKey)}
          >
            Cancel
          </Button>
        </>
      ),
    });
    return key;
  }, [enqueueSnackbar, closeSnackbar]);

  const showCustom = useCallback((content, options = {}) => {
    return enqueueSnackbar(content, {
      ...options,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
        ...options.anchorOrigin,
      },
    });
  }, [enqueueSnackbar]);

  return {
    isLoading,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showCustom,
    withLoading,
    confirmAction,
    closeNotification: closeSnackbar,
  };
};

export default useNotification;
