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
  Container,
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
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

import { fetchTasks } from '../store/slices/taskSlice';
import { fetchInternProfile } from '../store/slices/internSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import AnimatedCard from '../components/AnimatedCard';
import AnimatedButton from '../components/AnimatedButton';
import AnimatedIcon from '../components/AnimatedIcon';
import PageTransition from '../components/PageTransition';

// Stat Card Component
const StatCard = ({ title, value, icon, color, onClick, loading, delay }) => (
  <AnimatedCard delay={delay} onClick={onClick}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2" fontWeight={500}>
            {title}
          </Typography>
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            <Typography variant="h3" component="div" fontWeight={700} color="primary.main">
              {value}
            </Typography>
          )}
        </Box>
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.2 }}
        >
          <Avatar 
            sx={{ 
              bgcolor: `${color}.light`, 
              width: 56, 
              height: 56,
              background: `linear-gradient(135deg, ${color}.light 0%, ${color}.main 100%)`,
            }}
          >
            <AnimatedIcon delay={delay + 0.1}>
              {icon}
            </AnimatedIcon>
          </Avatar>
        </motion.div>
      </Box>
    </CardContent>
  </AnimatedCard>
);

// Recent Activity Component
const RecentActivity = ({ activities, loading }) => (
  <AnimatedCard delay={0.4}>
    <CardHeader 
      title={
        <Typography variant="h6" fontWeight={600}>
          Recent Activity
        </Typography>
      }
      action={
        <motion.div
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <Tooltip title="Refresh">
            <IconButton onClick={() => window.location.reload()}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </motion.div>
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
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ListItem disablePadding>
                <ListItemButton sx={{ borderRadius: 2, mb: 0.5 }}>
                  <ListItemIcon>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {activity.icon}
                    </motion.div>
                  </ListItemIcon>
                  <ListItemText
                    primary={activity.title}
                    secondary={activity.description}
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                  <Chip 
                    label={activity.status} 
                    size="small"
                    color={activity.status === 'completed' ? 'success' : 'warning'}
                    sx={{ fontWeight: 600 }}
                  />
                </ListItemButton>
              </ListItem>
              {index < activities.length - 1 && <Divider />}
            </motion.div>
          ))}
        </List>
      )}
    </CardContent>
  </AnimatedCard>
);

// Quick Actions Component
const QuickActions = ({ onActionClick }) => (
  <AnimatedCard delay={0.5}>
    <CardHeader 
      title={
        <Typography variant="h6" fontWeight={600}>
          Quick Actions
        </Typography>
      }
    />
    <Divider />
    <CardContent>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <AnimatedButton
            fullWidth
            variant="outlined"
            startIcon={<TaskIcon />}
            onClick={() => onActionClick('tasks')}
            delay={0.6}
            sx={{
              height: 48,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
              }
            }}
          >
            View Tasks
          </AnimatedButton>
        </Grid>
        <Grid item xs={12} sm={6}>
          <AnimatedButton
            fullWidth
            variant="outlined"
            startIcon={<CalendarIcon />}
            onClick={() => onActionClick('timeline')}
            delay={0.7}
            sx={{
              height: 48,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
              }
            }}
          >
            View Timeline
          </AnimatedButton>
        </Grid>
        <Grid item xs={12} sm={6}>
          <AnimatedButton
            fullWidth
            variant="outlined"
            startIcon={<PaymentIcon />}
            onClick={() => onActionClick('payments')}
            delay={0.8}
            sx={{
              height: 48,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
              }
            }}
          >
            Check Payments
          </AnimatedButton>
        </Grid>
        <Grid item xs={12} sm={6}>
          <AnimatedButton
            fullWidth
            variant="outlined"
            startIcon={<DocumentIcon />}
            onClick={() => onActionClick('documents')}
            delay={0.9}
            sx={{
              height: 48,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
              }
            }}
          >
            View Documents
          </AnimatedButton>
        </Grid>
      </Grid>
    </CardContent>
  </AnimatedCard>
);

// Welcome Section Component
const WelcomeSection = ({ user }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Box
      sx={{
        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
        borderRadius: 3,
        p: 4,
        mb: 4,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        style={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
        }}
      />
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Welcome back, {user?.name || 'Intern'}! 👋
      </Typography>
      <Typography variant="body1" sx={{ opacity: 0.9 }}>
        Here's what's happening with your internship today.
      </Typography>
    </Box>
  </motion.div>
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

  // Calculate stats
  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter(task => task.status === 'completed').length || 0;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Mock recent activities
  const recentActivities = [
    {
      id: 1,
      title: 'Task Completed',
      description: 'Frontend development task finished',
      status: 'completed',
      icon: <CompletedIcon color="success" />,
    },
    {
      id: 2,
      title: 'Payment Received',
      description: 'Monthly stipend processed',
      status: 'completed',
      icon: <PaymentIcon color="success" />,
    },
    {
      id: 3,
      title: 'Document Upload',
      description: 'Progress report submitted',
      status: 'pending',
      icon: <DocumentIcon color="warning" />,
    },
  ];

  if (tasksLoading || internLoading) {
    return <LoadingSpinner />;
  }

  return (
    <PageTransition>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box>
          <WelcomeSection user={user} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Tasks"
                value={totalTasks}
                icon={<TaskIcon />}
                color="primary"
                loading={tasksLoading}
                delay={0.1}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Completed"
                value={completedTasks}
                icon={<CompletedIcon />}
                color="success"
                loading={tasksLoading}
                delay={0.2}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Pending"
                value={pendingTasks}
                icon={<PendingIcon />}
                color="warning"
                loading={tasksLoading}
                delay={0.3}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Completion Rate"
                value={`${completionRate}%`}
                icon={<TimelineIcon />}
                color="info"
                loading={tasksLoading}
                delay={0.4}
              />
            </Grid>
          </Grid>

          <Box mt={4}>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={8}>
                <RecentActivity activities={recentActivities} loading={false} />
              </Grid>
              <Grid item xs={12} lg={4}>
                <QuickActions onActionClick={handleActionClick} />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </motion.div>
    </PageTransition>
  );
};

export default Dashboard;