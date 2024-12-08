import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  LinearProgress,
  useTheme,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const StatusCard = ({
  title,
  value,
  icon: Icon,
  color = 'primary',
  loading = false,
  trend,
  trendLabel,
  info,
  onClick,
}) => {
  const theme = useTheme();

  const getTrendColor = () => {
    if (trend > 0) return theme.palette.success.main;
    if (trend < 0) return theme.palette.error.main;
    return theme.palette.text.secondary;
  };

  const getTrendIcon = () => {
    if (trend > 0) return <TrendingUpIcon sx={{ color: getTrendColor() }} />;
    if (trend < 0) return <TrendingDownIcon sx={{ color: getTrendColor() }} />;
    return null;
  };

  return (
    <Card
      sx={{
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s',
        '&:hover': onClick ? {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4],
        } : {},
      }}
      onClick={onClick}
    >
      <CardContent>
        {loading && (
          <LinearProgress
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 2,
            }}
          />
        )}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 2,
          }}
        >
          <Typography
            variant="subtitle2"
            color="textSecondary"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            {title}
            {info && (
              <Tooltip title={info}>
                <IconButton size="small">
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Typography>
          {Icon && (
            <Icon
              sx={{
                color: theme.palette[color].main,
                fontSize: 24,
              }}
            />
          )}
        </Box>

        <Typography
          variant="h4"
          component="div"
          sx={{
            color: theme.palette.text.primary,
            mb: trend ? 1 : 0,
          }}
        >
          {value}
        </Typography>

        {(trend || trendLabel) && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            {getTrendIcon()}
            <Typography
              variant="body2"
              sx={{
                color: getTrendColor(),
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {trend && `${Math.abs(trend)}%`}
              {trendLabel && (
                <Typography
                  component="span"
                  variant="body2"
                  color="textSecondary"
                  sx={{ ml: 0.5 }}
                >
                  {trendLabel}
                </Typography>
              )}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StatusCard;
