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
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import TaskForm from '../components/tasks/TaskForm';
import TaskList from '../components/tasks/TaskList';
import TaskCalendar from '../components/tasks/TaskCalendar';
import TaskFilters from '../components/tasks/TaskFilters';
import LoadingSpinner from '../components/LoadingSpinner';
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
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

// Delete Confirmation Dialog
const DeleteConfirmationDialog = ({ open, onClose, onConfirm, taskTitle }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Confirm Delete</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Are you sure you want to delete "{taskTitle}"? This action cannot be undone.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={onConfirm} color="error" variant="contained">
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);

// Status Update Confirmation Dialog
const StatusUpdateDialog = ({ open, onClose, onConfirm, taskTitle, newStatus }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Update Task Status</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Are you sure you want to mark "{taskTitle}" as {newStatus}?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={onConfirm} color="primary" variant="contained">
        Update Status
      </Button>
    </DialogActions>
  </Dialog>
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

  if (loading && !refreshing) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Task Management
        </Typography>
        <Box>
          <Tooltip title="Refresh Tasks">
            <IconButton onClick={handleRefresh} disabled={refreshing}>
              {refreshing ? <CircularProgress size={24} /> : <RefreshIcon />}
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ ml: 2 }}
          >
            Create Task
          </Button>
        </Box>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <TaskFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          onViewChange={handleViewChange}
          currentView={view}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper>
        <Tabs
          value={view === 'list' ? 0 : 1}
          onChange={(_, value) => handleViewChange(value === 0 ? 'list' : 'calendar')}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="List View" />
          <Tab label="Calendar View" />
        </Tabs>

        <TabPanel value={view === 'list' ? 0 : 1} index={0}>
          <TaskList
            tasks={tasks}
            onEdit={handleOpenDialog}
            onDelete={handleDeleteClick}
            onStatusChange={handleStatusClick}
            loading={refreshing}
          />
        </TabPanel>
        <TabPanel value={view === 'list' ? 0 : 1} index={1}>
          <TaskCalendar
            tasks={tasks}
            onSelectTask={handleOpenDialog}
          />
        </TabPanel>
      </Paper>

      <TaskForm
        open={openDialog}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        initialValues={editingTask || undefined}
        title={editingTask ? 'Edit Task' : 'Create Task'}
      />

      <DeleteConfirmationDialog
        open={openDeleteDialog}
        onClose={() => {
          setOpenDeleteDialog(false);
          setTaskToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        taskTitle={taskToDelete?.title}
      />

      <StatusUpdateDialog
        open={openStatusDialog}
        onClose={() => {
          setOpenStatusDialog(false);
          setTaskToUpdate(null);
        }}
        onConfirm={handleStatusConfirm}
        taskTitle={taskToUpdate?.task?.title}
        newStatus={taskToUpdate?.newStatus}
      />
    </Container>
  );
};

export default TaskManagement;