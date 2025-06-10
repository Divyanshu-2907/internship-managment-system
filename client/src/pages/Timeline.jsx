import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  CircularProgress,
  Paper,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Assignment as TaskIcon,
  EmojiEvents as AchievementIcon,
  CalendarToday as CalendarIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  FilterList as FilterIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { format, differenceInDays, isAfter, isBefore, isToday } from 'date-fns';

import { fetchTimeline, addMilestone, updateMilestone, deleteMilestone } from '../store/slices/timelineSlice';
import LoadingSpinner from '../components/LoadingSpinner';

// Progress Card Component
const ProgressCard = ({ startDate, endDate, completedMilestones, totalMilestones }) => {
  const today = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const totalDays = differenceInDays(end, start);
  const daysCompleted = differenceInDays(today, start);
  const progress = Math.min(100, Math.max(0, (daysCompleted / totalDays) * 100));
  const milestoneProgress = (completedMilestones / totalMilestones) * 100;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Internship Progress
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Time Progress
              </Typography>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ height: 10, borderRadius: 5, mb: 1 }}
              />
              <Typography variant="body2" color="textSecondary">
                {daysCompleted} days completed out of {totalDays} days
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Milestone Progress
              </Typography>
              <LinearProgress
                variant="determinate"
                value={milestoneProgress}
                sx={{ height: 10, borderRadius: 5, mb: 1 }}
              />
              <Typography variant="body2" color="textSecondary">
                {completedMilestones} of {totalMilestones} milestones completed
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

// Timeline Item Component
const TimelineItem = ({ milestone, onEdit, onDelete, onStatusChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const isUpcoming = isAfter(new Date(milestone.date), new Date());
  const isPast = isBefore(new Date(milestone.date), new Date());
  const isCurrent = isToday(new Date(milestone.date));

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'primary';
      case 'upcoming':
        return 'default';
      default:
        return 'default';
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'education':
        return <SchoolIcon />;
      case 'work':
        return <WorkIcon />;
      case 'task':
        return <TaskIcon />;
      case 'achievement':
        return <AchievementIcon />;
      default:
        return <WorkIcon />;
    }
  };

  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action) => {
    handleMenuClose();
    switch (action) {
      case 'edit':
        onEdit(milestone);
        break;
      case 'delete':
        onDelete(milestone);
        break;
      case 'complete':
        onStatusChange(milestone, 'completed');
        break;
      case 'in-progress':
        onStatusChange(milestone, 'in-progress');
        break;
      default:
        break;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        mb: 4,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 24,
          top: 40,
          bottom: -32,
          width: 2,
          bgcolor: 'divider',
          zIndex: 0,
        },
        '&:last-child::before': {
          display: 'none',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mr: 2,
          zIndex: 1,
        }}
      >
        <Avatar
          sx={{
            bgcolor: `${getStatusColor(milestone.status)}.main`,
            width: 48,
            height: 48,
            mb: 1,
          }}
        >
          {getIcon(milestone.type)}
        </Avatar>
        <Typography variant="caption" color="textSecondary">
          {format(new Date(milestone.date), 'MMM d, yyyy')}
        </Typography>
      </Box>

      <Paper
        elevation={1}
        sx={{
          flex: 1,
          p: 2,
          position: 'relative',
          bgcolor: isCurrent ? 'action.hover' : 'background.paper',
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h6" gutterBottom>
              {milestone.title}
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              {milestone.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                size="small"
                label={milestone.type}
                icon={getIcon(milestone.type)}
              />
              <Chip
                size="small"
                label={milestone.status}
                color={getStatusColor(milestone.status)}
              />
            </Box>
          </Box>
          <IconButton size="small" onClick={handleMenuClick}>
            <MoreVertIcon />
          </IconButton>
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            style: {
              maxHeight: 48 * 4.5,
              width: '20ch',
            },
          }}
        >
          <MenuItem onClick={() => handleAction('edit')}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleAction('delete')}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => handleAction('complete')} disabled={milestone.status === 'completed'}>
            <ListItemIcon>
              <CheckCircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Mark as Completed</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleAction('in-progress')} disabled={milestone.status === 'in-progress'}>
            <ListItemIcon>
              <PendingIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Mark as In-Progress</ListItemText>
          </MenuItem>
        </Menu>
      </Paper>
    </Box>
  );
};

// Milestone Dialog Component
const MilestoneDialog = ({ open, onClose, milestone, onSubmit, loading }) => {
  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    date: Yup.date().nullable().required('Date is required'),
    type: Yup.string().required('Type is required'),
    status: Yup.string().required('Status is required'),
  });

  const formik = useFormik({
    initialValues: {
      title: milestone?.title || '',
      description: milestone?.description || '',
      date: milestone?.date ? format(new Date(milestone.date), 'yyyy-MM-dd') : '',
      type: milestone?.type || 'work',
      status: milestone?.status || 'upcoming',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      onSubmit({
        ...values,
        date: new Date(values.date).toISOString(),
      });
    },
  });

  useEffect(() => {
    if (!open) {
      formik.resetForm();
    }
  }, [open, formik]);

  const milestoneTypes = ['work', 'education', 'task', 'achievement'];
  const milestoneStatuses = ['upcoming', 'in-progress', 'completed'];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{milestone ? 'Edit Milestone' : 'Add New Milestone'}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          <TextField
            fullWidth
            id="title"
            name="title"
            label="Title"
            value={formik.values.title}
            onChange={formik.handleChange}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
            margin="normal"
          />
          <TextField
            fullWidth
            id="description"
            name="description"
            label="Description"
            multiline
            rows={4}
            value={formik.values.description}
            onChange={formik.handleChange}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
            margin="normal"
          />
          <TextField
            fullWidth
            id="date"
            name="date"
            label="Date"
            type="date"
            value={formik.values.date}
            onChange={formik.handleChange}
            error={formik.touched.date && Boolean(formik.errors.date)}
            helperText={formik.touched.date && formik.errors.date}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            fullWidth
            id="type"
            name="type"
            select
            label="Type"
            value={formik.values.type}
            onChange={formik.handleChange}
            error={formik.touched.type && Boolean(formik.errors.type)}
            helperText={formik.touched.type && formik.errors.type}
            margin="normal"
          >
            {milestoneTypes.map((option) => (
              <MenuItem key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            id="status"
            name="status"
            select
            label="Status"
            value={formik.values.status}
            onChange={formik.handleChange}
            error={formik.touched.status && Boolean(formik.errors.status)}
            helperText={formik.touched.status && formik.errors.status}
            margin="normal"
          >
            {milestoneStatuses.map((option) => (
              <MenuItem key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            <CancelIcon sx={{ mr: 1 }} /> Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : <SaveIcon sx={{ mr: 1 }} />}
            {milestone ? 'Save Changes' : 'Add Milestone'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const TimelineComponent = () => {
  const dispatch = useDispatch();
  const { milestones, loading, error } = useSelector(state => state.timeline);
  const [isMilestoneDialogOpen, setIsMilestoneDialogOpen] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState(null);

  // Default values for internship start and end dates (can be replaced with actual user data)
  const [internshipDates, setInternshipDates] = useState({
    startDate: new Date(2023, 0, 1).toISOString(), // January 1, 2023
    endDate: new Date(2023, 11, 31).toISOString(), // December 31, 2023
  });

  useEffect(() => {
    dispatch(fetchTimeline());
  }, [dispatch]);

  // Log state for debugging
  useEffect(() => {
    console.log('Timeline Milestones:', milestones);
    console.log('Timeline Loading:', loading);
    console.log('Timeline Error:', error);
    if (error) {
      toast.error(`Timeline Error: ${error}`);
    }
  }, [milestones, loading, error]);

  const handleAddClick = () => {
    setCurrentMilestone(null);
    setIsMilestoneDialogOpen(true);
  };

  const handleEditClick = (milestone) => {
    setCurrentMilestone(milestone);
    setIsMilestoneDialogOpen(true);
  };

  const handleDeleteClick = async (milestone) => {
    if (window.confirm(`Are you sure you want to delete "${milestone.title}"?`)) {
      try {
        await dispatch(deleteMilestone(milestone.id)).unwrap();
        toast.success('Milestone deleted successfully!');
      } catch (err) {
        toast.error(`Failed to delete milestone: ${err}`);
      }
    }
  };

  const handleStatusChange = async (milestone, newStatus) => {
    try {
      await dispatch(updateMilestone({ id: milestone.id, milestone: { ...milestone, status: newStatus } })).unwrap();
      toast.success(`Milestone marked as ${newStatus} successfully!`);
    } catch (err) {
      toast.error(`Failed to update milestone status: ${err}`);
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (currentMilestone) {
        await dispatch(updateMilestone({ id: currentMilestone.id, milestone: values })).unwrap();
        toast.success('Milestone updated successfully!');
      } else {
        await dispatch(addMilestone(values)).unwrap();
        toast.success('Milestone added successfully!');
      }
      setIsMilestoneDialogOpen(false);
    } catch (err) {
      toast.error(`Failed to save milestone: ${err}`);
    }
  };

  const completedMilestonesCount = milestones.filter(m => m.status === 'completed').length;

  if (loading && milestones.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <ProgressCard
            startDate={internshipDates.startDate}
            endDate={internshipDates.endDate}
            completedMilestones={completedMilestonesCount}
            totalMilestones={milestones.length}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Internship Timeline
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          Add Milestone
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {milestones.length === 0 && !loading && !error ? (
        <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No milestones found.
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Start by adding your first internship milestone!
          </Typography>
        </Paper>
      ) : (
        <Box>
          {milestones.map((milestone) => (
            <TimelineItem
              key={milestone.id}
              milestone={milestone}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              onStatusChange={handleStatusChange}
            />
          ))}
        </Box>
      )}

      <MilestoneDialog
        open={isMilestoneDialogOpen}
        onClose={() => setIsMilestoneDialogOpen(false)}
        milestone={currentMilestone}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </Box>
  );
};

export default TimelineComponent; 