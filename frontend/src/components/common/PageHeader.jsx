import {
  Box,
  Typography,
  Breadcrumbs,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import AddIcon from '@mui/icons-material/Add';

const PageHeader = ({
  title,
  breadcrumbs = [],
  action,
  actionIcon = <AddIcon />,
  actionText = 'Add New',
  children,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ mb: 3 }}>
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          sx={{ mb: 2 }}
        >
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            
            return isLast ? (
              <Typography
                key={crumb.path || index}
                color="text.primary"
                variant="body2"
              >
                {crumb.label}
              </Typography>
            ) : (
              <RouterLink
                key={crumb.path || index}
                to={crumb.path}
                style={{
                  color: theme.palette.text.secondary,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                <Typography variant="body2">{crumb.label}</Typography>
              </RouterLink>
            );
          })}
        </Breadcrumbs>
      )}

      {/* Header Content */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 'bold',
              color: theme.palette.text.primary,
            }}
          >
            {title}
          </Typography>
        </Box>

        {action && (
          <Button
            variant="contained"
            color="primary"
            startIcon={actionIcon}
            onClick={action}
            sx={{
              minWidth: isMobile ? '100%' : 'auto',
            }}
          >
            {actionText}
          </Button>
        )}
      </Box>

      {/* Optional Additional Content */}
      {children && (
        <Box
          sx={{
            mt: 2,
            width: '100%',
          }}
        >
          {children}
        </Box>
      )}
    </Box>
  );
};

export default PageHeader;
