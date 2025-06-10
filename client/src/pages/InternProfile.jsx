import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Button,
  LinearProgress,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Paper,
  Tab,
  Tabs,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Star as StarIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  Description as DocumentIcon,
  PhotoCamera as PhotoIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { updateInternProfile, fetchInternProfile } from '../store/slices/internSlice';
import LoadingSpinner from '../components/LoadingSpinner';

// Profile Header Component
const ProfileHeader = ({ intern, onEdit, onStatusChange, onMenuClick, anchorEl, onMenuClose }) => {
  if (!intern) {
    return null; // Or a loading skeleton
  }

  return (
    <Card>
      <CardContent>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Box position="relative">
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  fontSize: '2.5rem',
                  bgcolor: 'primary.main',
                  border: '4px solid',
                  borderColor: 'background.paper',
                  boxShadow: 1,
                }}
              >
                {intern.name ? intern.name.charAt(0).toUpperCase() : ''}
              </Avatar>
              <Tooltip title="Change Photo">
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                  size="small"
                  onClick={() => {/* TODO: Implement photo upload */}}
                >
                  <PhotoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
          <Grid item xs>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="h4" gutterBottom>
                  {intern.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                  {intern.status && (
                    <Chip
                      label={intern.status.charAt(0).toUpperCase() + intern.status.slice(1)}
                      color={intern.status === 'active' ? 'success' : intern.status === 'completed' ? 'info' : 'error'}
                    />
                  )}
                  {intern.department && (
                    <Chip
                      label={intern.department}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {intern.startDate && (
                    <Chip
                      icon={<CalendarIcon />}
                      label={`Joined ${new Date(intern.startDate).toLocaleDateString()}`}
                      variant="outlined"
                    />
                  )}
                </Box>
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  {intern.linkedin && (
                    <Tooltip title="LinkedIn Profile">
                      <IconButton
                        color="primary"
                        href={intern.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <LinkedInIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  {intern.github && (
                    <Tooltip title="GitHub Profile">
                      <IconButton
                        color="primary"
                        href={intern.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <GitHubIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </Box>
              <Box>
                <IconButton onClick={onMenuClick}>
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={onMenuClose}
                >
                  <MenuItem onClick={onEdit}>
                    <ListItemIcon>
                      <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Edit Profile</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => onStatusChange('completed')}>
                    <ListItemIcon>
                      <StarIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Mark as Completed</ListItemText>
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

// Profile Stats Component
const ProfileStats = ({ tasks, documents }) => {
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Task Progress
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Completion Rate
              </Typography>
              <LinearProgress
                variant="determinate"
                value={completionRate}
                sx={{ height: 10, borderRadius: 5, mb: 1 }}
              />
              <Typography variant="body2" color="textSecondary">
                {completedTasks} of {totalTasks} tasks completed
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Documents
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <DocumentIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Internship Certificate"
                  secondary="Available upon completion"
                />
                <Button
                  startIcon={<DownloadIcon />}
                  disabled={!documents?.certificate}
                  onClick={() => {/* TODO: Implement certificate download */}}
                >
                  Download
                </Button>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <DocumentIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Letter of Recommendation"
                  secondary="Available upon completion"
                />
                <Button
                  startIcon={<DownloadIcon />}
                  disabled={!documents?.lor}
                  onClick={() => {/* TODO: Implement LOR download */}}
                >
                  Download
                </Button>
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

// Profile Details Component
const ProfileDetails = ({ intern }) => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Contact Information
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <List>
            <ListItem>
              <ListItemIcon>
                <EmailIcon />
              </ListItemIcon>
              <ListItemText
                primary="Email"
                secondary={intern.email}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <PhoneIcon />
              </ListItemIcon>
              <ListItemText
                primary="Phone"
                secondary={intern.phone || 'Not provided'}
              />
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={12} sm={6}>
          <List>
            <ListItem>
              <ListItemIcon>
                <SchoolIcon />
              </ListItemIcon>
              <ListItemText
                primary="Education"
                secondary={intern.education || 'Not provided'}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <LocationIcon />
              </ListItemIcon>
              <ListItemText
                primary="Location"
                secondary={intern.location || 'Not provided'}
              />
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

// Edit Profile Dialog Component
const EditProfileDialog = ({ open, onClose, intern, onSubmit, loading }) => {
  const formik = useFormik({
    initialValues: {
      name: intern.name || '',
      email: intern.email || '',
      phone: intern.phone || '',
      education: intern.education || '',
      location: intern.location || '',
      linkedin: intern.linkedin || '',
      github: intern.github || '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      phone: Yup.string(),
      education: Yup.string(),
      location: Yup.string(),
      linkedin: Yup.string().url('Invalid LinkedIn URL'),
      github: Yup.string().url('Invalid GitHub URL'),
    }),
    onSubmit: async (values) => {
      try {
        await onSubmit(values);
        onClose();
      } catch (error) {
        // Error is handled by the parent component
      }
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
            />
            <TextField
              fullWidth
              label="Education"
              name="education"
              value={formik.values.education}
              onChange={formik.handleChange}
              error={formik.touched.education && Boolean(formik.errors.education)}
              helperText={formik.touched.education && formik.errors.education}
            />
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={formik.values.location}
              onChange={formik.handleChange}
              error={formik.touched.location && Boolean(formik.errors.location)}
              helperText={formik.touched.location && formik.errors.location}
            />
            <TextField
              fullWidth
              label="LinkedIn Profile"
              name="linkedin"
              value={formik.values.linkedin}
              onChange={formik.handleChange}
              error={formik.touched.linkedin && Boolean(formik.errors.linkedin)}
              helperText={formik.touched.linkedin && formik.errors.linkedin}
            />
            <TextField
              fullWidth
              label="GitHub Profile"
              name="github"
              value={formik.values.github}
              onChange={formik.handleChange}
              error={formik.touched.github && Boolean(formik.errors.github)}
              helperText={formik.touched.github && formik.errors.github}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            disabled={loading || !formik.isValid || !formik.dirty}
          >
            Save Changes
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const InternProfile = () => {
  const dispatch = useDispatch();
  const { currentIntern, loading: internLoading } = useSelector(state => state.intern);
  const { tasks, loading: tasksLoading } = useSelector(state => state.task);
  const { user } = useSelector(state => state.auth);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    dispatch(fetchInternProfile());
  }, [dispatch]);

  const handleEditClick = () => {
    setEditDialogOpen(true);
    setMenuAnchorEl(null);
  };

  const handleMenuClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true);
      await dispatch(updateInternProfile({ ...currentIntern, status: newStatus })).unwrap();
      toast.success('Profile status updated successfully');
      setMenuAnchorEl(null);
    } catch (error) {
      toast.error(error.message || 'Failed to update profile status');
    } finally {
      setUpdating(false);
    }
  };

  const handleProfileUpdate = async (values) => {
    try {
      setUpdating(true);
      await dispatch(updateInternProfile({ ...currentIntern, ...values })).unwrap();
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
      throw error;
    } finally {
      setUpdating(false);
    }
  };

  const loading = internLoading || tasksLoading || updating;

  if (loading && !updating) {
    return <LoadingSpinner fullScreen />;
  }

  if (!currentIntern) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">
          No intern profile found. Please contact your administrator.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ProfileHeader
            intern={currentIntern}
            onEdit={handleEditClick}
            onStatusChange={handleStatusChange}
            onMenuClick={handleMenuClick}
            anchorEl={menuAnchorEl}
            onMenuClose={handleMenuClose}
          />
        </Grid>

        <Grid item xs={12}>
          <ProfileStats
            tasks={tasks}
            documents={currentIntern.documents}
          />
        </Grid>

        <Grid item xs={12}>
          <ProfileDetails intern={currentIntern} />
        </Grid>
      </Grid>

      <EditProfileDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        intern={currentIntern}
        onSubmit={handleProfileUpdate}
        loading={updating}
      />
    </Box>
  );
};

export default InternProfile;