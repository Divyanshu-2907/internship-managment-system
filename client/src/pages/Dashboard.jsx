import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Divider,
  LinearProgress,
  Grid,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Assignment as TaskIcon,
  CheckCircle as CompletedIcon,
  Pending as PendingIcon,
  Timeline as TimelineIcon,
  AttachMoney as PaymentIcon,
  ArrowForward as ArrowForwardIcon,
  Refresh as RefreshIcon,
  CalendarToday as CalendarIcon,
  Description as DocumentIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import { fetchTasks } from '../store/slices/taskSlice';
import { fetchInternProfile } from '../store/slices/internSlice';
import LoadingSpinner from '../components/LoadingSpinner';

// Stat Card Component
const StatCard = ({ title, value, icon, color, onClick, loading }) => (
  <Card 
    sx={{ 
      height: '100%',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'transform 0.2s',
      '&:hover': onClick ? { transform: 'translateY(-4px)' } : {},
    }}
    onClick={onClick}
  >
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom>
            {title}
          </Typography>
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            <Typography variant="h4" component="div">
              {value}
            </Typography>
          )}
        </Box>
        <Avatar sx={{ bgcolor: `${color}.light`, width: 48, height: 48 }}>
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

// Recent Activity Component
const RecentActivity = ({ activities, loading }) => (
  <Card sx={{ height: '100%' }}>
    <CardHeader 
      title="Recent Activity" 
      action={
        <Tooltip title="Refresh">
          <IconButton onClick={() => window.location.reload()}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      }
    />
    <Divider />
    <CardContent>
      {loading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : activities.length === 0 ? (
        <Typography color="textSecondary" align="center" py={2}>
          No recent activity
        </Typography>
      ) : (
        <List>
          {activities.map((activity, index) => (
            <React.Fragment key={activity.id}>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {activity.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={activity.title}
                    secondary={activity.description}
                  />
                  <Chip 
                    label={activity.status} 
                    size="small"
                    color={activity.status === 'completed' ? 'success' : 'warning'}
                  />
                </ListItemButton>
              </ListItem>
              {index < activities.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      )}
    </CardContent>
  </Card>
);

// Quick Actions Component
const QuickActions = ({ onActionClick }) => (
  <Card sx={{ height: '100%' }}>
    <CardHeader title="Quick Actions" />
    <Divider />
    <CardContent>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<TaskIcon />}
            onClick={() => onActionClick('tasks')}
          >
            View Tasks
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<CalendarIcon />}
            onClick={() => onActionClick('timeline')}
          >
            View Timeline
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<PaymentIcon />}
            onClick={() => onActionClick('payments')}
          >
            Check Payments
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<DocumentIcon />}
            onClick={() => onActionClick('documents')}
          >
            View Documents
          </Button>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { tasks, loading: tasksLoading } = useSelector(state => state.task);
  const { currentIntern, loading: internLoading } = useSelector(state => state.intern);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setRefreshing(true);
        await Promise.all([
          dispatch(fetchTasks()).unwrap(),
          dispatch(fetchInternProfile()).unwrap(),
        ]);
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setRefreshing(false);
      }
    };

    fetchData();
  }, [dispatch]);

  const handleActionClick = (action) => {
    navigate(`/${action}`);
  };

  const loading = tasksLoading || internLoading || refreshing;

  if (loading && !refreshing) {
    return <LoadingSpinner fullScreen />;
  }

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const recentActivities = [
    ...tasks.slice(0, 5).map(task => ({
      id: task.id,
      title: task.title,
      description: `Due: ${new Date(task.dueDate).toLocaleDateString()}`,
      status: task.status,
      icon: task.status === 'completed' ? <CompletedIcon /> : <PendingIcon />,
    })),
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome back, {user?.name || 'Intern'}!
          </Typography>
          <Typography color="textSecondary">
            Here's an overview of your internship progress
          </Typography>
        </Box>
        <Tooltip title="Refresh Dashboard">
          <IconButton onClick={() => window.location.reload()} disabled={refreshing}>
            {refreshing ? <CircularProgress size={24} /> : <RefreshIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      {!currentIntern && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Please complete your profile to access all features.
          <Button 
            color="inherit" 
            size="small" 
            sx={{ ml: 2 }}
            onClick={() => navigate('/profile')}
          >
            Complete Profile
          </Button>
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Stats Section */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Tasks"
                value={totalTasks}
                icon={<TaskIcon />}
                color="primary"
                onClick={() => handleActionClick('tasks')}
                loading={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Completed"
                value={completedTasks}
                icon={<CompletedIcon />}
                color="success"
                loading={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Pending"
                value={pendingTasks}
                icon={<PendingIcon />}
                color="warning"
                loading={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Completion Rate"
                value={`${Math.round(completionRate)}%`}
                icon={<TimelineIcon />}
                color="info"
                loading={loading}
              />
            </Grid>
          </Grid>

          {/* Progress Section */}
          <Card sx={{ mt: 3 }}>
            <CardHeader title="Overall Progress" />
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Task Completion
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={completionRate} 
                  sx={{ height: 10, borderRadius: 5 }}
                />
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  {completedTasks} of {totalTasks} tasks completed
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions and Recent Activity */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <QuickActions onActionClick={handleActionClick} />
            </Grid>
            <Grid item xs={12}>
              <RecentActivity activities={recentActivities} loading={loading} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;