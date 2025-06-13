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
  Container,
  FormControl,
  InputLabel,
  Select,
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
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { format, differenceInDays, isAfter, isBefore, isToday } from 'date-fns';
import { motion } from 'framer-motion';

import { fetchTimeline, addMilestone, updateMilestone, deleteMilestone } from '../store/slices/timelineSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import AnimatedCard from '../components/AnimatedCard';
import AnimatedButton from '../components/AnimatedButton';
import AnimatedIcon from '../components/AnimatedIcon';
import PageTransition from '../components/PageTransition';

// Progress Card Component
const ProgressCard = ({ startDate, endDate, completedMilestones, totalMilestones, delay }) => {
  const today = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const totalDays = differenceInDays(end, start);
  const daysCompleted = differenceInDays(today, start);
  const progress = Math.min(100, Math.max(0, (daysCompleted / totalDays) * 100));
  const milestoneProgress = (completedMilestones / totalMilestones) * 100;

  return (
    <AnimatedCard delay={delay}>
      <CardContent>
        <Typography variant="h6" gutterBottom fontWeight={600}>
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
    </AnimatedCard>
  );
};

// Timeline Item Component
const TimelineItem = ({ milestone, onEdit, onDelete, onStatusChange, delay }) => {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
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
            <AnimatedIcon>
              {getIcon(milestone.type)}
            </AnimatedIcon>
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
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="h6" gutterBottom fontWeight={600}>
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
                  sx={{ fontWeight: 600 }}
                />
                <Chip
                  size="small"
                  label={milestone.status}
                  color={getStatusColor(milestone.status)}
                  sx={{ fontWeight: 600 }}
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
            <MenuItem onClick={() => handleAction('complete')}>
              <ListItemIcon>
                <CheckCircleIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Mark as Completed</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleAction('in-progress')}>
              <ListItemIcon>
                <PendingIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Mark In Progress</ListItemText>
            </MenuItem>
          </Menu>
        </Paper>
      </Box>
    </motion.div>
  );
};

// Milestone Dialog Component (Add/Edit Form)
const MilestoneDialog = ({ open, onClose, milestone, onSubmit, loading }) => {
  const initialValues = {
    title: milestone?.title || '',
    description: milestone?.description || '',
    date: milestone?.date ? format(new Date(milestone.date), 'yyyy-MM-dd') : '',
    type: milestone?.type || 'work',
    status: milestone?.status || 'upcoming',
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    date: Yup.string().required('Date is required'),
    type: Yup.string().required('Type is required'),
    status: Yup.string().required('Status is required'),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
    enableReinitialize: true,
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{
        component: motion.div,
        initial: { opacity: 0, scale: 0.9, y: 50 },
        animate: { opacity: 1, scale: 1, y: 0 },
        transition: { duration: 0.3 },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" fontWeight={600}>{milestone ? 'Edit Milestone' : 'Add Milestone'}</Typography>
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                {...formik.getFieldProps('title')}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                {...formik.getFieldProps('description')}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                {...formik.getFieldProps('date')}
                error={formik.touched.date && Boolean(formik.errors.date)}
                helperText={formik.touched.date && formik.errors.date}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={formik.touched.type && Boolean(formik.errors.type)}>
                <InputLabel>Type</InputLabel>
                <Select
                  label="Type"
                  {...formik.getFieldProps('type')}
                >
                  <MenuItem value="work">Work</MenuItem>
                  <MenuItem value="education">Education</MenuItem>
                  <MenuItem value="task">Task</MenuItem>
                  <MenuItem value="achievement">Achievement</MenuItem>
                </Select>
                {formik.touched.type && formik.errors.type && (
                  <Typography variant="caption" color="error">{formik.errors.type}</Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={formik.touched.status && Boolean(formik.errors.status)}>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  {...formik.getFieldProps('status')}
                >
                  <MenuItem value="upcoming">Upcoming</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
                {formik.touched.status && formik.errors.status && (
                  <Typography variant="caption" color="error">{formik.errors.status}</Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <AnimatedButton onClick={onClose}>Cancel</AnimatedButton>
          <AnimatedButton type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Save'}
          </AnimatedButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const TimelineComponent = () => {
  const dispatch = useDispatch();
  const { milestones, loading, error } = useSelector((state) => state.timeline);
  const { currentIntern } = useSelector((state) => state.intern);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchTimelineData();
  }, [filterType, filterStatus]);

  const fetchTimelineData = async () => {
    try {
      setRefreshing(true);
      await dispatch(fetchTimeline({ type: filterType, status: filterStatus })).unwrap();
    } catch (err) {
      toast.error(err.message || 'Failed to fetch timeline data');
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddClick = () => {
    setEditingMilestone(null);
    setOpenDialog(true);
  };

  const handleEditClick = (milestone) => {
    setEditingMilestone(milestone);
    setOpenDialog(true);
  };

  const handleDeleteClick = async (milestone) => {
    try {
      await dispatch(deleteMilestone(milestone.id)).unwrap();
      toast.success('Milestone deleted successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to delete milestone');
    }
  };

  const handleStatusChange = async (milestone, newStatus) => {
    try {
      await dispatch(updateMilestone({ ...milestone, status: newStatus })).unwrap();
      toast.success('Milestone status updated successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to update milestone status');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingMilestone) {
        await dispatch(updateMilestone({ ...editingMilestone, ...values })).unwrap();
        toast.success('Milestone updated successfully');
      } else {
        await dispatch(addMilestone(values)).unwrap();
        toast.success('Milestone added successfully');
      }
      setOpenDialog(false);
    } catch (err) {
      toast.error(err.message || 'Failed to save milestone');
    }
  };

  const sortedMilestones = [...milestones].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Calculate overall internship start and end dates for Progress Card
  const internshipStartDate = currentIntern?.startDate || '2023-01-01'; // Default or actual start date
  const internshipEndDate = currentIntern?.endDate || '2024-12-31'; // Default or actual end date

  const completedMilestonesCount = milestones.filter(m => m.status === 'completed').length;

  if (loading && !refreshing) {
    return <LoadingSpinner message="Loading timeline..." />;
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
            Internship Timeline
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track your key milestones and progress throughout your internship
          </Typography>
        </Box>
      </motion.div>

      {/* Progress Card */}
      <Box sx={{ mb: 4 }}>
        <ProgressCard
          startDate={internshipStartDate}
          endDate={internshipEndDate}
          completedMilestones={completedMilestonesCount}
          totalMilestones={milestones.length}
          delay={0.1}
        />
      </Box>

      {/* Action Bar and Filters */}
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
              onClick={handleAddClick}
              delay={0.6}
            >
              Add Milestone
            </AnimatedButton>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Tooltip title="Refresh">
                <IconButton onClick={fetchTimelineData} disabled={refreshing}>
                  {refreshing ? <CircularProgress size={20} /> : <RefreshIcon />}
                </IconButton>
              </Tooltip>
            </motion.div>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={filterType}
                label="Type"
                onChange={(e) => setFilterType(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="work">Work</MenuItem>
                <MenuItem value="education">Education</MenuItem>
                <MenuItem value="task">Task</MenuItem>
                <MenuItem value="achievement">Achievement</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                label="Status"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="upcoming">Upcoming</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </motion.div>

      {/* Timeline Items */}
      <Box>
        {sortedMilestones.length === 0 && !loading && (
          <Alert severity="info">No milestones found matching your criteria.</Alert>
        )}
        {sortedMilestones.map((milestone, index) => (
          <TimelineItem
            key={milestone.id}
            milestone={milestone}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onStatusChange={handleStatusChange}
            delay={0.1 + index * 0.1}
          />
        ))}
      </Box>

      <MilestoneDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        milestone={editingMilestone}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </PageTransition>
  );
};

export default TimelineComponent; 