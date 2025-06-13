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
  Container,
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
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';

import { updateInternProfile, fetchInternProfile } from '../store/slices/internSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import AnimatedCard from '../components/AnimatedCard';
import AnimatedButton from '../components/AnimatedButton';
import AnimatedIcon from '../components/AnimatedIcon';
import PageTransition from '../components/PageTransition';

// Profile Header Component
const ProfileHeader = ({ intern, onEdit, onStatusChange, onMenuClick, anchorEl, onMenuClose }) => {
  if (!intern) {
    return null; // Or a loading skeleton
  }

  return (
    <AnimatedCard delay={0.1}>
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
                <Typography variant="h4" gutterBottom fontWeight={700}>
                  {intern.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                  {intern.status && (
                    <Chip
                      label={intern.status.charAt(0).toUpperCase() + intern.status.slice(1)}
                      color={intern.status === 'active' ? 'success' : intern.status === 'completed' ? 'info' : intern.status === 'inactive' ? 'error' : 'default'}
                      sx={{ fontWeight: 600 }}
                    />
                  )}
                  {intern.department && (
                    <Chip
                      label={intern.department}
                      color="primary"
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                  )}
                  {intern.startDate && (
                    <Chip
                      icon={<CalendarIcon />}
                      label={`Joined ${new Date(intern.startDate).toLocaleDateString()}`}
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                  )}
                </Box>
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  {intern.linkedin && (
                    <Tooltip title="LinkedIn Profile">
                      <AnimatedIcon>
                        <LinkedInIcon />
                      </AnimatedIcon>
                    </Tooltip>
                  )}
                  {intern.github && (
                    <Tooltip title="GitHub Profile">
                      <AnimatedIcon>
                        <GitHubIcon />
                      </AnimatedIcon>
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
    </AnimatedCard>
  );
};

// Profile Stats Component
const ProfileStats = ({ tasks, documents }) => {
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <AnimatedCard delay={0.2}>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Task Progress
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Task Completion
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={completionRate} 
                sx={{ height: 10, borderRadius: 5, mb: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                {completedTasks} of {totalTasks} tasks completed ({completionRate}%)
              </Typography>
            </Box>
          </CardContent>
        </AnimatedCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <AnimatedCard delay={0.3}>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Documents Overview
            </Typography>
            <List dense>
              <ListItem disablePadding>
                <ListItemIcon>
                  <DocumentIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary={`Total Documents: ${documents.length}`} />
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText primary={`Approved: ${documents.filter(d => d.status === 'approved').length}`} />
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon>
                  <WarningIcon color="warning" />
                </ListItemIcon>
                <ListItemText primary={`Pending: ${documents.filter(d => d.status === 'pending').length}`} />
              </ListItem>
            </List>
          </CardContent>
        </AnimatedCard>
      </Grid>
    </Grid>
  );
};

// Profile Details Component
const ProfileDetails = ({ intern }) => (
  <AnimatedCard delay={0.4}>
    <CardContent>
      <Typography variant="h6" gutterBottom fontWeight={600}>
        Details
      </Typography>
      <List dense>
        <ListItem>
          <ListItemIcon>
            <EmailIcon color="action" />
          </ListItemIcon>
          <ListItemText primary="Email" secondary={intern.email} />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <PhoneIcon color="action" />
          </ListItemIcon>
          <ListItemText primary="Phone" secondary={intern.phone || 'N/A'} />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <LocationIcon color="action" />
          </ListItemIcon>
          <ListItemText primary="Location" secondary={intern.location || 'N/A'} />
        </ListItem>
        <Divider component="li" />
        <ListItem>
          <ListItemIcon>
            <SchoolIcon color="action" />
          </ListItemIcon>
          <ListItemText primary="University" secondary={intern.university || 'N/A'} />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <WorkIcon color="action" />
          </ListItemIcon>
          <ListItemText primary="Field of Study" secondary={intern.fieldOfStudy || 'N/A'} />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <CalendarIcon color="action" />
          </ListItemIcon>
          <ListItemText primary="Graduation Year" secondary={intern.graduationYear || 'N/A'} />
        </ListItem>
      </List>
    </CardContent>
  </AnimatedCard>
);

// Edit Profile Dialog Component
const EditProfileDialog = ({ open, onClose, intern, onSubmit, loading }) => {
  const initialValues = {
    name: intern?.name || '',
    email: intern?.email || '',
    phone: intern?.phone || '',
    location: intern?.location || '',
    university: intern?.university || '',
    fieldOfStudy: intern?.fieldOfStudy || '',
    graduationYear: intern?.graduationYear || '',
    linkedin: intern?.linkedin || '',
    github: intern?.github || '',
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().matches(/^[0-9]{10}$/, 'Phone number is not valid').notRequired(),
    location: Yup.string().notRequired(),
    university: Yup.string().notRequired(),
    fieldOfStudy: Yup.string().notRequired(),
    graduationYear: Yup.number().typeError('Must be a number').min(1900, 'Invalid year').max(2100, 'Invalid year').notRequired(),
    linkedin: Yup.string().url('Invalid URL').notRequired(),
    github: Yup.string().url('Invalid URL').notRequired(),
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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth
      PaperProps={{
        component: motion.div,
        initial: { opacity: 0, scale: 0.9, y: 50 },
        animate: { opacity: 1, scale: 1, y: 0 },
        transition: { duration: 0.3 },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" fontWeight={600}>Edit Profile</Typography>
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                {...formik.getFieldProps('name')}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                {...formik.getFieldProps('email')}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                {...formik.getFieldProps('phone')}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                {...formik.getFieldProps('location')}
                error={formik.touched.location && Boolean(formik.errors.location)}
                helperText={formik.touched.location && formik.errors.location}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="University"
                {...formik.getFieldProps('university')}
                error={formik.touched.university && Boolean(formik.errors.university)}
                helperText={formik.touched.university && formik.errors.university}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Field of Study"
                {...formik.getFieldProps('fieldOfStudy')}
                error={formik.touched.fieldOfStudy && Boolean(formik.errors.fieldOfStudy)}
                helperText={formik.touched.fieldOfStudy && formik.errors.fieldOfStudy}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Graduation Year"
                type="number"
                {...formik.getFieldProps('graduationYear')}
                error={formik.touched.graduationYear && Boolean(formik.errors.graduationYear)}
                helperText={formik.touched.graduationYear && formik.errors.graduationYear}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="LinkedIn Profile URL"
                {...formik.getFieldProps('linkedin')}
                error={formik.touched.linkedin && Boolean(formik.errors.linkedin)}
                helperText={formik.touched.linkedin && formik.errors.linkedin}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="GitHub Profile URL"
                {...formik.getFieldProps('github')}
                error={formik.touched.github && Boolean(formik.errors.github)}
                helperText={formik.touched.github && formik.errors.github}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <AnimatedButton onClick={onClose}>Cancel</AnimatedButton>
          <AnimatedButton type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
          </AnimatedButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const InternProfile = () => {
  const dispatch = useDispatch();
  const { currentIntern, loading, error } = useSelector((state) => state.intern);
  const { tasks } = useSelector((state) => state.task);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [anchorElMenu, setAnchorElMenu] = useState(null);

  useEffect(() => {
    dispatch(fetchInternProfile());
  }, [dispatch]);

  // Mock data for tasks and documents (replace with actual Redux state/API calls)
  const mockTasks = [
    { id: 't1', title: 'Complete onboarding modules', status: 'completed' },
    { id: 't2', title: 'Set up development environment', status: 'completed' },
    { id: 't3', title: 'First project assignment', status: 'pending' },
    { id: 't4', title: 'Attend team meeting', status: 'pending' },
  ];

  const mockDocuments = [
    { id: 'd1', title: 'Internship Agreement', status: 'approved' },
    { id: 'd2', title: 'Resume', status: 'pending' },
  ];

  const handleEditClick = () => {
    setOpenEditDialog(true);
    setAnchorElMenu(null);
  };

  const handleMenuClick = (event) => {
    setAnchorElMenu(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorElMenu(null);
  };

  const handleStatusChange = async (newStatus) => {
    if (currentIntern) {
      try {
        // Assuming an updateInternProfile action exists that takes an object with changes
        await dispatch(updateInternProfile({ id: currentIntern.id, status: newStatus })).unwrap();
        toast.success(`Intern status updated to ${newStatus}`);
      } catch (err) {
        toast.error('Failed to update status');
      }
    }
    handleMenuClose();
  };

  const handleProfileUpdate = async (values) => {
    if (currentIntern) {
      try {
        await dispatch(updateInternProfile({ id: currentIntern.id, ...values })).unwrap();
        toast.success('Profile updated successfully');
        setOpenEditDialog(false);
      } catch (err) {
        toast.error(err.message || 'Failed to update profile');
      }
    }
  };

  if (loading || !currentIntern) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  return (
    <PageTransition>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
              Intern Profile
            </Typography>
            <Typography variant="body1" color="text.secondary">
              View and manage your personal and internship details
            </Typography>
          </Box>

          <ProfileHeader
            intern={currentIntern}
            onEdit={handleEditClick}
            onStatusChange={handleStatusChange}
            onMenuClick={handleMenuClick}
            anchorEl={anchorElMenu}
            onMenuClose={handleMenuClose}
          />

          <Box sx={{ mt: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={6}>
                <ProfileStats tasks={tasks || mockTasks} documents={mockDocuments} />
              </Grid>
              <Grid item xs={12} lg={6}>
                <ProfileDetails intern={currentIntern} />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </motion.div>

      <EditProfileDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        intern={currentIntern}
        onSubmit={handleProfileUpdate}
        loading={loading}
      />
    </PageTransition>
  );
};

export default InternProfile;