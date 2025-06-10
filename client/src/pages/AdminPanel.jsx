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
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';

import {
  addIntern,
  updateIntern,
  removeIntern,
  setCurrentIntern,
  fetchInterns,
} from '../store/slices/internSlice';
import LoadingSpinner from '../components/LoadingSpinner';

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
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
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
        <CircularProgress />
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
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Mentor</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Performance</TableCell>
            <TableCell>Actions</TableCell>
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
                />
              </TableCell>
              <TableCell>
                <Rating value={intern.performanceRating || 0} readOnly precision={0.5} />
              </TableCell>
              <TableCell>
                <Tooltip title="Edit">
                  <IconButton onClick={() => onEdit(intern)} size="small">
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton onClick={() => onDelete(intern.id)} size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Generate Certificate">
                  <IconButton onClick={() => onGenerateCertificate(intern.id)} size="small" color="primary">
                    <DescriptionIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Generate LOR">
                  <IconButton onClick={() => onGenerateLOR(intern.id)} size="small" color="secondary">
                    <DownloadIcon />
                  </IconButton>
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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialValues ? 'Edit Intern' : 'Add New Intern'}
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
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
              <FormControl fullWidth>
                <InputLabel>Payment Status</InputLabel>
                <Select
                  name="paymentStatus"
                  value={formik.values.paymentStatus}
                  onChange={formik.handleChange}
                  error={formik.touched.paymentStatus && Boolean(formik.errors.paymentStatus)}
                >
                  <MenuItem value="unpaid">Unpaid</MenuItem>
                  <MenuItem value="partial">Partial</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {formik.values.paymentStatus !== 'unpaid' && (
              <Grid item xs={12}>
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="feedback"
                label="Feedback"
                value={formik.values.feedback}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography component="legend">Performance Rating</Typography>
              <Rating
                name="performanceRating"
                value={formik.values.performanceRating}
                onChange={(_, value) => formik.setFieldValue('performanceRating', value)}
                precision={0.5}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !formik.isValid || formik.isSubmitting}
          >
            {loading ? <CircularProgress size={24} /> : initialValues ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const DeleteConfirmationDialog = ({ open, onClose, onConfirm, internName }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Confirm Delete</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Are you sure you want to delete {internName}? This action cannot be undone.
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

const AdminPanel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { interns, loading, error } = useSelector((state) => state.intern);
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editingIntern, setEditingIntern] = useState(null);
  const [internToDelete, setInternToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchInterns());
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (intern) => {
    if (intern) {
      setEditingIntern(intern);
    } else {
      setEditingIntern(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingIntern(null);
  };

  const handleSubmit = async (values) => {
    try {
      if (editingIntern) {
        await dispatch(updateIntern({
          ...editingIntern,
          ...values,
          startDate: values.startDate?.toISOString() || '',
          endDate: values.endDate?.toISOString() || '',
        })).unwrap();
      } else {
        await dispatch(addIntern({
          id: Date.now().toString(),
          ...values,
          startDate: values.startDate?.toISOString() || '',
          endDate: values.endDate?.toISOString() || '',
        })).unwrap();
      }
      handleCloseDialog();
    } catch (error) {
      toast.error(error.message || 'An error occurred');
      throw error;
    }
  };

  const handleDeleteClick = (internId) => {
    const intern = interns.find((i) => i.id === internId);
    setInternToDelete(intern);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(removeIntern(internToDelete.id)).unwrap();
      toast.success('Intern deleted successfully');
      setOpenDeleteDialog(false);
      setInternToDelete(null);
    } catch (error) {
      toast.error(error.message || 'An error occurred');
    }
  };

  const handleGenerateCertificate = async (internId) => {
    try {
      // TODO: Implement certificate generation
      toast.info('Certificate generation coming soon');
    } catch (error) {
      toast.error(error.message || 'An error occurred');
    }
  };

  const handleGenerateLOR = async (internId) => {
    try {
      // TODO: Implement LOR generation
      toast.info('LOR generation coming soon');
    } catch (error) {
      toast.error(error.message || 'An error occurred');
    }
  };

  const activeInterns = interns.filter((intern) => intern.status === 'active');
  const completedInterns = interns.filter((intern) => intern.status === 'completed');
  const terminatedInterns = interns.filter((intern) => intern.status === 'terminated');

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Admin Panel</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Intern
        </Button>
      </Box>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label={`Active (${activeInterns.length})`} />
            <Tab label={`Completed (${completedInterns.length})`} />
            <Tab label={`Terminated (${terminatedInterns.length})`} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <InternTable
            interns={activeInterns}
            onEdit={handleOpenDialog}
            onDelete={handleDeleteClick}
            onGenerateCertificate={handleGenerateCertificate}
            onGenerateLOR={handleGenerateLOR}
            loading={loading}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <InternTable
            interns={completedInterns}
            onEdit={handleOpenDialog}
            onDelete={handleDeleteClick}
            onGenerateCertificate={handleGenerateCertificate}
            onGenerateLOR={handleGenerateLOR}
            loading={loading}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <InternTable
            interns={terminatedInterns}
            onEdit={handleOpenDialog}
            onDelete={handleDeleteClick}
            onGenerateCertificate={handleGenerateCertificate}
            onGenerateLOR={handleGenerateLOR}
            loading={loading}
          />
        </TabPanel>
      </Card>

      <InternFormDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        initialValues={editingIntern}
        loading={loading}
      />

      <DeleteConfirmationDialog
        open={openDeleteDialog}
        onClose={() => {
          setOpenDeleteDialog(false);
          setInternToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        internName={internToDelete?.name}
      />
    </Box>
  );
};

export default AdminPanel;