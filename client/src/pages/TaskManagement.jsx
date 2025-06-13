import React, { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  Box,
  Button,
  Container,
  Typography,
  Alert,
  Snackbar,
  Paper,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  Assignment as TaskIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

import TaskForm from '../components/tasks/TaskForm';
import TaskList from '../components/tasks/TaskList';
import TaskCalendar from '../components/tasks/TaskCalendar';
import TaskFilters from '../components/tasks/TaskFilters';
import LoadingSpinner from '../components/LoadingSpinner';
import AnimatedCard from '../components/AnimatedCard';
import AnimatedButton from '../components/AnimatedButton';
import AnimatedIcon from '../components/AnimatedIcon';
import PageTransition from '../components/PageTransition';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  setCurrentTask,
  setFilters,
  setPagination,
} from '../store/slices/taskSlice';

// Tab Panel Component
const TabPanel = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box sx={{ p: 3 }}>{children}</Box>
      </motion.div>
    )}
  </div>
);

// Delete Confirmation Dialog
const DeleteConfirmationDialog = ({ open, onClose, onConfirm, taskTitle }) => (
  <Dialog 
    open={open} 
    onClose={onClose}
    PaperProps={{
      component: motion.div,
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.2 },
    }}
  >
    <DialogTitle>Confirm Delete</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Are you sure you want to delete "{taskTitle}"? This action cannot be undone.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <AnimatedButton onClick={onClose}>Cancel</AnimatedButton>
      <AnimatedButton onClick={onConfirm} color="error" variant="contained">
        Delete
      </AnimatedButton>
    </DialogActions>
  </Dialog>
);

// Status Update Confirmation Dialog
const StatusUpdateDialog = ({ open, onClose, onConfirm, taskTitle, newStatus }) => (
  <Dialog 
    open={open} 
    onClose={onClose}
    PaperProps={{
      component: motion.div,
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.2 },
    }}
  >
    <DialogTitle>Update Task Status</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Are you sure you want to mark "{taskTitle}" as {newStatus}?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <AnimatedButton onClick={onClose}>Cancel</AnimatedButton>
      <AnimatedButton onClick={onConfirm} color="primary" variant="contained">
        Update Status
      </AnimatedButton>
    </DialogActions>
  </Dialog>
);

// Stats Card Component
const StatsCard = ({ title, value, icon, color, delay }) => (
  <AnimatedCard delay={delay}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2" fontWeight={500}>
            {title}
          </Typography>
          <Typography variant="h4" component="div" fontWeight={700} color="primary.main">
            {value}
          </Typography>
        </Box>
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.2 }}
        >
          <AnimatedIcon size="large" delay={delay + 0.1}>
            {icon}
          </AnimatedIcon>
        </motion.div>
      </Box>
    </CardContent>
  </AnimatedCard>
);

const TaskManagement = () => {
  const dispatch = useAppDispatch();
  const { tasks, loading, error, filters, pagination } = useAppSelector((state) => state.task);
  const [view, setView] = useState('list');
  const [sortBy, setSortBy] = useState('dueDate');
  const [sortOrder, setSortOrder] = useState('asc');
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [taskToUpdate, setTaskToUpdate] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch tasks with debounce
  const fetchTasksWithDebounce = useCallback(async () => {
    try {
      setRefreshing(true);
      await dispatch(fetchTasks({ pagination, filters })).unwrap();
    } catch (error) {
      toast.error(error.message || 'Failed to fetch tasks');
    } finally {
      setRefreshing(false);
    }
  }, [dispatch, pagination, filters]);

  useEffect(() => {
    fetchTasksWithDebounce();
  }, [fetchTasksWithDebounce]);

  const handleOpenDialog = (task) => {
    if (task) {
      setEditingTask(task);
    } else {
      setEditingTask(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTask(null);
  };

  const handleSubmit = async (values) => {
    try {
      if (editingTask) {
        await dispatch(updateTask({ ...editingTask, ...values })).unwrap();
        toast.success('Task updated successfully');
      } else {
        await dispatch(createTask(values)).unwrap();
        toast.success('Task created successfully');
      }
      handleCloseDialog();
    } catch (error) {
      toast.error(error.message || 'An error occurred');
      throw error;
    }
  };

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteTask(taskToDelete.id)).unwrap();
      toast.success('Task deleted successfully');
      setOpenDeleteDialog(false);
      setTaskToDelete(null);
    } catch (error) {
      toast.error(error.message || 'An error occurred');
    }
  };

  const handleStatusClick = (task, newStatus) => {
    setTaskToUpdate({ task, newStatus });
    setOpenStatusDialog(true);
  };

  const handleStatusConfirm = async () => {
    try {
      const { task, newStatus } = taskToUpdate;
      await dispatch(updateTask({ ...task, status: newStatus })).unwrap();
      toast.success(`Task marked as ${newStatus}`);
      setOpenStatusDialog(false);
      setTaskToUpdate(null);
    } catch (error) {
      toast.error(error.message || 'An error occurred');
    }
  };

  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters));
  };

  const handleSortChange = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
    dispatch(setPagination({ ...pagination, sortBy: field, sortOrder: order }));
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const handleRefresh = () => {
    fetchTasksWithDebounce();
  };

  // Calculate stats
  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter(task => task.status === 'completed').length || 0;
  const pendingTasks = tasks?.filter(task => task.status === 'pending').length || 0;
  const overdueTasks = tasks?.filter(task => 
    task.status !== 'completed' && new Date(task.dueDate) < new Date()
  ).length || 0;

  if (loading && !refreshing) {
    return <LoadingSpinner message="Loading tasks..." />;
  }

  return (
    <PageTransition>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
            Task Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Organize and track your internship tasks and deadlines
          </Typography>
        </Box>
      </motion.div>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Tasks"
            value={totalTasks}
            icon={<TaskIcon />}
            color="primary"
            delay={0.1}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Completed"
            value={completedTasks}
            icon={<CheckCircleIcon />}
            color="success"
            delay={0.2}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Pending"
            value={pendingTasks}
            icon={<ScheduleIcon />}
            color="warning"
            delay={0.3}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Overdue"
            value={overdueTasks}
            icon={<TrendingUpIcon />}
            color="error"
            delay={0.4}
          />
        </Grid>
      </Grid>

      {/* Action Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <AnimatedButton
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              delay={0.6}
            >
              Add Task
            </AnimatedButton>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Tooltip title="Refresh">
                <IconButton onClick={handleRefresh} disabled={refreshing}>
                  {refreshing ? <CircularProgress size={20} /> : <RefreshIcon />}
                </IconButton>
              </Tooltip>
            </motion.div>
          </Box>

          <TaskFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
            sortBy={sortBy}
            sortOrder={sortOrder}
          />
        </Box>
      </motion.div>

      {/* View Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <Paper sx={{ width: '100%', mb: 3 }}>
          <Tabs
            value={view}
            onChange={(e, newValue) => handleViewChange(newValue)}
            sx={{
              '& .MuiTab-root': {
                fontWeight: 600,
                textTransform: 'none',
              },
            }}
          >
            <Tab label="List View" value="list" />
            <Tab label="Calendar View" value="calendar" />
          </Tabs>
        </Paper>
      </motion.div>

      {/* Content */}
      <TabPanel value={view} index="list">
        <TaskList
          tasks={tasks}
          onEdit={handleOpenDialog}
          onDelete={handleDeleteClick}
          onStatusChange={handleStatusClick}
          loading={loading}
        />
      </TabPanel>

      <TabPanel value={view} index="calendar">
        <TaskCalendar
          tasks={tasks}
          onTaskClick={handleOpenDialog}
          loading={loading}
        />
      </TabPanel>

      {/* Dialogs */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          component: motion.div,
          initial: { opacity: 0, scale: 0.9, y: 50 },
          animate: { opacity: 1, scale: 1, y: 0 },
          transition: { duration: 0.3 },
        }}
      >
        <TaskForm
          task={editingTask}
          onSubmit={handleSubmit}
          onCancel={handleCloseDialog}
          loading={loading}
        />
      </Dialog>

      <DeleteConfirmationDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        taskTitle={taskToDelete?.title}
      />

      <StatusUpdateDialog
        open={openStatusDialog}
        onClose={() => setOpenStatusDialog(false)}
        onConfirm={handleStatusConfirm}
        taskTitle={taskToUpdate?.task?.title}
        newStatus={taskToUpdate?.newStatus}
      />

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => dispatch({ type: 'task/clearError' })}
      >
        <Alert severity="error" onClose={() => dispatch({ type: 'task/clearError' })}>
          {error}
        </Alert>
      </Snackbar>
    </PageTransition>
  );
};

export default TaskManagement;