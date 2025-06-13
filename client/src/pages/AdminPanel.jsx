import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  FormControl,
  InputLabel,
  Select,
  Rating,
  Alert,
  CircularProgress,
  Tooltip,
  DialogContentText,
  Container,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Description as DescriptionIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

import {
  addIntern,
  updateIntern,
  removeIntern,
  setCurrentIntern,
  fetchInterns,
} from '../store/slices/internSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import AnimatedButton from '../components/AnimatedButton';
import PageTransition from '../components/PageTransition';
import AnimatedCard from '../components/AnimatedCard';
import AnimatedIcon from '../components/AnimatedIcon';

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  department: yup.string().required('Department is required'),
  mentor: yup.string().required('Mentor is required'),
  startDate: yup.date().required('Start date is required'),
  endDate: yup.date()
    .required('End date is required')
    .min(yup.ref('startDate'), 'End date must be after start date'),
  skills: yup.array().of(yup.string()).min(1, 'At least one skill is required'),
  paymentStatus: yup.string().required('Payment status is required'),
  paymentAmount: yup.number().when('paymentStatus', {
    is: (status) => status !== 'unpaid',
    then: (schema) => schema.required('Payment amount is required for paid internships'),
  }),
});

const TabPanel = ({ children, value, index }) => (
  <motion.div
    role="tabpanel"
    hidden={value !== index}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
  </motion.div>
);

const InternTable = ({
  interns,
  onEdit,
  onDelete,
  onGenerateCertificate,
  onGenerateLOR,
  loading,
}) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <LoadingSpinner />
      </Box>
    );
  }

  if (interns.length === 0) {
    return (
      <Box p={3} textAlign="center">
        <Typography color="text.secondary">No interns found</Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Department</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Mentor</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Performance</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {interns.map((intern) => (
            <TableRow key={intern.id} hover>
              <TableCell>{intern.name}</TableCell>
              <TableCell>{intern.email}</TableCell>
              <TableCell>{intern.department}</TableCell>
              <TableCell>{intern.mentor}</TableCell>
              <TableCell>
                <Chip
                  label={intern.status}
                  color={
                    intern.status === 'active'
                      ? 'success'
                      : intern.status === 'completed'
                      ? 'primary'
                      : 'error'
                  }
                  sx={{ fontWeight: 600 }}
                />
              </TableCell>
              <TableCell>
                <Rating value={intern.performanceRating || 0} readOnly precision={0.5} />
              </TableCell>
              <TableCell>
                <Tooltip title="Edit">
                  <span style={{ display: 'inline-flex' }}>
                    <AnimatedButton onClick={() => onEdit(intern)} size="small">
                      <EditIcon />
                    </AnimatedButton>
                  </span>
                </Tooltip>
                <Tooltip title="Delete">
                  <span style={{ display: 'inline-flex' }}>
                    <AnimatedButton onClick={() => onDelete(intern.id)} size="small" color="error" sx={{ ml: 1 }}>
                      <DeleteIcon />
                    </AnimatedButton>
                  </span>
                </Tooltip>
                <Tooltip title="Generate Certificate">
                  <span style={{ display: 'inline-flex' }}>
                    <AnimatedButton onClick={() => onGenerateCertificate(intern.id)} size="small" color="primary" sx={{ ml: 1 }}>
                      <DescriptionIcon />
                    </AnimatedButton>
                  </span>
                </Tooltip>
                <Tooltip title="Generate LOR">
                  <span style={{ display: 'inline-flex' }}>
                    <AnimatedButton onClick={() => onGenerateLOR(intern.id)} size="small" color="secondary" sx={{ ml: 1 }}>
                      <DownloadIcon />
                    </AnimatedButton>
                  </span>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const InternFormDialog = ({
  open,
  onClose,
  onSubmit,
  initialValues,
  loading,
}) => {
  const formik = useFormik({
    initialValues: initialValues || {
      name: '',
      email: '',
      department: '',
      mentor: '',
      startDate: null,
      endDate: null,
      skills: [],
      paymentStatus: 'unpaid',
      paymentAmount: 0,
      status: 'active',
      performanceRating: 0,
      feedback: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await onSubmit(values);
        toast.success(initialValues ? 'Intern updated successfully' : 'Intern added successfully');
      } catch (error) {
        toast.error(error.message || 'An error occurred');
      }
    },
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
        <Typography variant="h6" fontWeight={600}>{initialValues ? 'Edit Intern' : 'Add New Intern'}</Typography>
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="name"
                label="Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="email"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="department"
                label="Department"
                value={formik.values.department}
                onChange={formik.handleChange}
                error={formik.touched.department && Boolean(formik.errors.department)}
                helperText={formik.touched.department && formik.errors.department}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="mentor"
                label="Mentor"
                value={formik.values.mentor}
                onChange={formik.handleChange}
                error={formik.touched.mentor && Boolean(formik.errors.mentor)}
                helperText={formik.touched.mentor && formik.errors.mentor}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Start Date"
                value={formik.values.startDate}
                onChange={(date) => formik.setFieldValue('startDate', date)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                    helperText={formik.touched.startDate && formik.errors.startDate}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="End Date"
                value={formik.values.endDate}
                onChange={(date) => formik.setFieldValue('endDate', date)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                    helperText={formik.touched.endDate && formik.errors.endDate}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="skills"
                label="Skills (comma-separated)"
                value={formik.values.skills.join(', ')}
                onChange={(e) => formik.setFieldValue('skills', e.target.value.split(',').map(s => s.trim()))}
                error={formik.touched.skills && Boolean(formik.errors.skills)}
                helperText={formik.touched.skills && formik.errors.skills}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={formik.touched.paymentStatus && Boolean(formik.errors.paymentStatus)}>
                <InputLabel>Payment Status</InputLabel>
                <Select
                  name="paymentStatus"
                  label="Payment Status"
                  value={formik.values.paymentStatus}
                  onChange={formik.handleChange}
                >
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="unpaid">Unpaid</MenuItem>
                </Select>
                {formik.touched.paymentStatus && formik.errors.paymentStatus && (
                  <Typography variant="caption" color="error">{formik.errors.paymentStatus}</Typography>
                )}
              </FormControl>
            </Grid>
            {formik.values.paymentStatus !== 'unpaid' && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="paymentAmount"
                  label="Payment Amount"
                  type="number"
                  value={formik.values.paymentAmount}
                  onChange={formik.handleChange}
                  error={formik.touched.paymentAmount && Boolean(formik.errors.paymentAmount)}
                  helperText={formik.touched.paymentAmount && formik.errors.paymentAmount}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  label="Status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="performanceRating"
                label="Performance Rating (0-5)"
                type="number"
                inputProps={{ min: 0, max: 5, step: 0.5 }}
                value={formik.values.performanceRating}
                onChange={formik.handleChange}
                error={formik.touched.performanceRating && Boolean(formik.errors.performanceRating)}
                helperText={formik.touched.performanceRating && formik.errors.performanceRating}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="feedback"
                label="Feedback"
                multiline
                rows={3}
                value={formik.values.feedback}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <AnimatedButton onClick={onClose}>Cancel</AnimatedButton>
          <AnimatedButton type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : (initialValues ? 'Update Intern' : 'Add Intern')}
          </AnimatedButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const DeleteConfirmationDialog = ({ open, onClose, onConfirm, internName, loading }) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
    PaperProps={{
      component: motion.div,
      initial: { opacity: 0, scale: 0.9, y: 50 },
      animate: { opacity: 1, scale: 1, y: 0 },
      transition: { duration: 0.3 },
    }}
  >
    <DialogTitle>
      <Typography variant="h6" fontWeight={600}>Delete Intern</Typography>
    </DialogTitle>
    <DialogContent dividers>
      <DialogContentText>
        Are you sure you want to delete intern <b>{internName}</b>? This action cannot be undone.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <AnimatedButton onClick={onClose}>Cancel</AnimatedButton>
      <AnimatedButton onClick={onConfirm} color="error" variant="contained" disabled={loading}>
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Delete'}
      </AnimatedButton>
    </DialogActions>
  </Dialog>
);

const AdminPanel = () => {
  const dispatch = useDispatch();
  const { interns, loading, error } = useSelector((state) => state.intern);
  const [currentTab, setCurrentTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingIntern, setEditingIntern] = useState(null);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [internToDelete, setInternToDelete] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchInternsData();
  }, []);

  const fetchInternsData = async () => {
    try {
      setRefreshing(true);
      await dispatch(fetchInterns()).unwrap();
    } catch (err) {
      toast.error(err.message || 'Failed to fetch interns');
    } finally {
      setRefreshing(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleOpenDialog = (intern) => {
    setEditingIntern(intern);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingIntern(null);
  };

  const handleSubmit = async (values) => {
    try {
      if (editingIntern) {
        await dispatch(updateIntern({ id: editingIntern.id, ...values })).unwrap();
      } else {
        await dispatch(addIntern(values)).unwrap();
      }
      handleCloseDialog();
    } catch (err) {
      toast.error(err.message || 'Failed to save intern');
    }
  };

  const handleDeleteClick = (internId) => {
    setInternToDelete(interns.find(intern => intern.id === internId));
    setOpenDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (internToDelete) {
      try {
        await dispatch(removeIntern(internToDelete.id)).unwrap();
        toast.success('Intern deleted successfully');
        setOpenDeleteConfirm(false);
        setInternToDelete(null);
      } catch (err) {
        toast.error(err.message || 'Failed to delete intern');
      }
    }
  };

  const handleGenerateCertificate = async (internId) => {
    toast.info(`Generating certificate for intern ${internId}`);
    // TODO: Implement certificate generation logic
  };

  const handleGenerateLOR = async (internId) => {
    toast.info(`Generating LOR for intern ${internId}`);
    // TODO: Implement LOR generation logic
  };

  if (loading && !refreshing) {
    return <LoadingSpinner message="Loading admin panel..." />;
  }

  return (
    <PageTransition>
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box>
            <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
              Admin Panel
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage interns, settings, and system configurations
            </Typography>
          </Box>
        </motion.div>

        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 3 }}
        >
          <Tab label="Interns" />
          <Tab label="Settings" />
        </Tabs>

        <TabPanel value={currentTab} index={0}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
              <AnimatedButton
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog(null)}
                delay={0.3}
              >
                Add Intern
              </AnimatedButton>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Tooltip title="Refresh">
                  <IconButton onClick={fetchInternsData} disabled={refreshing} sx={{ ml: 1 }}>
                    {refreshing ? <CircularProgress size={20} /> : <RefreshIcon />}
                  </IconButton>
                </Tooltip>
              </motion.div>
            </Box>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <InternTable
              interns={interns}
              onEdit={handleOpenDialog}
              onDelete={handleDeleteClick}
              onGenerateCertificate={handleGenerateCertificate}
              onGenerateLOR={handleGenerateLOR}
              loading={loading}
            />
          </motion.div>
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          <Typography variant="h6">Admin Settings</Typography>
          <Typography variant="body1" color="text.secondary">
            (Coming Soon) Configure system-wide settings and manage user roles.
          </Typography>
        </TabPanel>

        <InternFormDialog
          open={openDialog}
          onClose={handleCloseDialog}
          onSubmit={handleSubmit}
          initialValues={editingIntern}
          loading={loading}
        />

        <DeleteConfirmationDialog
          open={openDeleteConfirm}
          onClose={() => setOpenDeleteConfirm(false)}
          onConfirm={handleDeleteConfirm}
          internName={internToDelete?.name}
          loading={loading}
        />
      </Container>
    </PageTransition>
  );
};

export default AdminPanel;