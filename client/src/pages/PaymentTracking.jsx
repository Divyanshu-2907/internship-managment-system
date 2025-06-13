import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  IconButton,
  Tooltip,
  CircularProgress,
  LinearProgress,
  Divider,
  Container,
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';
import { toast } from 'react-toastify';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';

import AnimatedCard from '../components/AnimatedCard';
import AnimatedButton from '../components/AnimatedButton';
import AnimatedIcon from '../components/AnimatedIcon';
import PageTransition from '../components/PageTransition';
import LoadingSpinner from '../components/LoadingSpinner';

// Validation schema for payment form
const paymentSchema = Yup.object().shape({
  date: Yup.date().required('Date is required'),
  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be positive')
    .min(0, 'Amount must be positive'),
  type: Yup.string().required('Type is required'),
  description: Yup.string().required('Description is required'),
  status: Yup.string().required('Status is required'),
});

// Payment type options
const PAYMENT_TYPES = {
  STIPEND: 'stipend',
  BONUS: 'bonus',
  REIMBURSEMENT: 'reimbursement',
  OTHER: 'other',
};

// Payment status options
const PAYMENT_STATUS = {
  PAID: 'paid',
  PENDING: 'pending',
  OVERDUE: 'overdue',
};

// Mock Data
const mockPayments = [
  { id: '1', date: '2023-01-01T00:00:00Z', amount: 500, type: 'stipend', description: 'January Stipend', status: 'paid' },
  { id: '2', date: '2023-02-01T00:00:00Z', amount: 500, type: 'stipend', description: 'February Stipend', status: 'pending' },
  { id: '3', date: '2023-02-15T00:00:00Z', amount: 50, type: 'reimbursement', description: 'Travel Reimbursement', status: 'paid' },
  { id: '4', date: '2023-03-01T00:00:00Z', amount: 500, type: 'stipend', description: 'March Stipend', status: 'overdue' },
  { id: '5', date: '2023-03-10T00:00:00Z', amount: 100, type: 'bonus', description: 'Performance Bonus', status: 'pending' },
];

// Summary Card Component
const SummaryCard = ({ title, value, icon: Icon, color, subtitle, delay }) => (
  <AnimatedCard delay={delay}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <AnimatedIcon>
          <Icon sx={{ mr: 1, color: `${color}.main` }} />
        </AnimatedIcon>
        <Typography variant="h6" fontWeight={600}>{title}</Typography>
      </Box>
      <Typography variant="h4" color={`${color}.main`} fontWeight={700}>
        ${value}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </AnimatedCard>
);

// Payment Form Dialog Component
const PaymentFormDialog = ({ open, onClose, payment, onSubmit, loading }) => {
  const initialValues = payment || {
    date: new Date(),
    amount: '',
    type: PAYMENT_TYPES.STIPEND,
    description: '',
    status: PAYMENT_STATUS.PENDING,
  };

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
        <Typography variant="h6" fontWeight={600}>{payment ? 'Edit Payment' : 'Add Payment'}</Typography>
      </DialogTitle>
      <Formik
        initialValues={initialValues}
        validationSchema={paymentSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched, setFieldValue, isSubmitting }) => (
          <Form>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Field name="date">
                    {({ field, form }) => (
                      <TextField
                        {...field}
                        label="Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        error={touched.date && Boolean(errors.date)}
                        helperText={touched.date && errors.date}
                        value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                        onChange={(e) => form.setFieldValue('date', new Date(e.target.value))}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field name="amount">
                    {({ field, form }) => (
                      <TextField
                        {...field}
                        label="Amount"
                        type="number"
                        fullWidth
                        error={touched.amount && Boolean(errors.amount)}
                        helperText={touched.amount && errors.amount}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field name="type">
                    {({ field, form }) => (
                      <FormControl fullWidth error={touched.type && Boolean(errors.type)}>
                        <InputLabel>Type</InputLabel>
                        <Select {...field} label="Type">
                          {Object.entries(PAYMENT_TYPES).map(([key, value]) => (
                            <MenuItem key={value} value={value}>
                              {key.charAt(0) + key.slice(1).toLowerCase()}
                            </MenuItem>
                          ))}
                        </Select>
                        {touched.type && errors.type && (
                          <Typography variant="caption" color="error">{errors.type}</Typography>
                        )}
                      </FormControl>
                    )}
                  </Field>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field name="status">
                    {({ field, form }) => (
                      <FormControl fullWidth error={touched.status && Boolean(errors.status)}>
                        <InputLabel>Status</InputLabel>
                        <Select {...field} label="Status">
                          {Object.entries(PAYMENT_STATUS).map(([key, value]) => (
                            <MenuItem key={value} value={value}>
                              {key.charAt(0) + key.slice(1).toLowerCase()}
                            </MenuItem>
                          ))}
                        </Select>
                        {touched.status && errors.status && (
                          <Typography variant="caption" color="error">{errors.status}</Typography>
                        )}
                      </FormControl>
                    )}
                  </Field>
                </Grid>
                <Grid item xs={12}>
                  <Field name="description">
                    {({ field, form }) => (
                      <TextField
                        {...field}
                        label="Description"
                        fullWidth
                        multiline
                        rows={3}
                        error={touched.description && Boolean(errors.description)}
                        helperText={touched.description && errors.description}
                      />
                    )}
                  </Field>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <AnimatedButton onClick={onClose}>Cancel</AnimatedButton>
              <AnimatedButton
                type="submit"
                variant="contained"
                disabled={isSubmitting || loading}
                startIcon={isSubmitting || loading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {payment ? 'Update' : 'Add'} Payment
              </AnimatedButton>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

// Delete Confirmation Dialog Component
const DeleteConfirmationDialog = ({ open, onClose, onConfirm, payment, loading }) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
    PaperProps={{
      component: motion.div,
      initial: { opacity: 0, scale: 0.9, y: 50 },
      animate: { opacity: 1, scale: 1, y: 0 },
      transition: { duration: 0.3 },
    }}
  >
    <DialogTitle>
      <Typography variant="h6" fontWeight={600}>Delete Payment</Typography>
    </DialogTitle>
    <DialogContent dividers>
      <Typography>
        Are you sure you want to delete the payment for <b>{payment?.description}</b> on <b>{payment?.date ? new Date(payment.date).toLocaleDateString() : ''}</b>?
        This action cannot be undone.
      </Typography>
    </DialogContent>
    <DialogActions>
      <AnimatedButton onClick={onClose}>Cancel</AnimatedButton>
      <AnimatedButton
        onClick={onConfirm}
        color="error"
        variant="contained"
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
      >
        Delete
      </AnimatedButton>
    </DialogActions>
  </Dialog>
);

const PaymentTracking = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setRefreshing(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPayments(mockPayments);
    } catch (err) {
      toast.error('Failed to fetch payments');
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddPayment = () => {
    setSelectedPayment(null);
    setOpenFormDialog(true);
  };

  const handleEditPayment = (payment) => {
    setSelectedPayment(payment);
    setOpenFormDialog(true);
  };

  const handleDeletePayment = (payment) => {
    setSelectedPayment(payment);
    setOpenDeleteDialog(true);
  };

  const handleSubmitPayment = async (values, { resetForm }) => {
    try {
      setLoading(true);
      if (selectedPayment) {
        // Update existing payment
        await new Promise((resolve) => setTimeout(resolve, 500));
        setPayments(prev => prev.map(p => p.id === selectedPayment.id ? { ...p, ...values } : p));
        toast.success('Payment updated successfully');
      } else {
        // Add new payment
        await new Promise((resolve) => setTimeout(resolve, 500));
        const newPayment = { id: Date.now().toString(), ...values, date: values.date.toISOString() };
        setPayments(prev => [...prev, newPayment]);
        toast.success('Payment added successfully');
      }
      setOpenFormDialog(false);
      resetForm();
    } catch (err) {
      toast.error('Failed to save payment');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setPayments(prev => prev.filter(p => p.id !== selectedPayment.id));
      toast.success('Payment deleted successfully');
      setOpenDeleteDialog(false);
    } catch (err) {
      toast.error('Failed to delete payment');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = (payment) => {
    toast.info(`Downloading receipt for ${payment.description}`);
    // TODO: Implement actual download logic
  };

  const handlePrintReceipt = (payment) => {
    toast.info(`Printing receipt for ${payment.description}`);
    // TODO: Implement actual print logic
  };

  const filteredPayments = payments.filter(payment => {
    const typeMatch = filterType === 'all' || payment.type === filterType;
    const statusMatch = filterStatus === 'all' || payment.status === filterStatus;
    return typeMatch && statusMatch;
  });

  const totalPaid = payments.filter(p => p.status === PAYMENT_STATUS.PAID).reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter(p => p.status === PAYMENT_STATUS.PENDING).reduce((sum, p) => sum + p.amount, 0);
  const totalOverdue = payments.filter(p => p.status === PAYMENT_STATUS.OVERDUE).reduce((sum, p) => sum + p.amount, 0);

  if (loading && !refreshing) {
    return <LoadingSpinner message="Loading payments..." />;
  }

  return (
    <PageTransition>
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
              Payment Tracking
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Monitor all your internship payments and financial records
            </Typography>
          </Box>
        </motion.div>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <SummaryCard
              title="Total Paid"
              value={totalPaid.toFixed(2)}
              icon={MoneyIcon}
              color="success"
              subtitle={`${payments.filter(p => p.status === PAYMENT_STATUS.PAID).length} payments`}
              delay={0.1}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <SummaryCard
              title="Total Pending"
              value={totalPending.toFixed(2)}
              icon={PaymentIcon}
              color="warning"
              subtitle={`${payments.filter(p => p.status === PAYMENT_STATUS.PENDING).length} payments`}
              delay={0.2}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <SummaryCard
              title="Total Overdue"
              value={totalOverdue.toFixed(2)}
              icon={ReceiptIcon}
              color="error"
              subtitle={`${payments.filter(p => p.status === PAYMENT_STATUS.OVERDUE).length} payments`}
              delay={0.3}
            />
          </Grid>
        </Grid>

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
                onClick={handleAddPayment}
                delay={0.6}
              >
                Add Payment
              </AnimatedButton>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Tooltip title="Refresh">
                  <span style={{ display: 'inline-flex' }}>
                    <IconButton onClick={fetchPayments} disabled={refreshing}>
                      {refreshing ? <CircularProgress size={20} /> : <RefreshIcon />}
                    </IconButton>
                  </span>
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
                  {Object.values(PAYMENT_TYPES).map((type) => (
                    <MenuItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </MenuItem>
                  ))}
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
                  {Object.values(PAYMENT_STATUS).map((status) => (
                    <MenuItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </motion.div>

        {/* Payments Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 3, boxShadow: 3 }}>
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader aria-label="payments table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPayments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ textAlign: 'center', py: 3 }}>
                        <Alert severity="info">No payments found matching your criteria.</Alert>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPayments.map((payment) => (
                      <TableRow key={payment.id} hover>
                        <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                        <TableCell>${payment.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Chip
                            label={payment.type}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell>{payment.description}</TableCell>
                        <TableCell>
                          <Chip
                            label={payment.status}
                            size="small"
                            color={payment.status === PAYMENT_STATUS.PAID ? 'success' : payment.status === PAYMENT_STATUS.PENDING ? 'warning' : 'error'}
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Download Receipt">
                            <AnimatedButton size="small" onClick={() => handleDownloadReceipt(payment)}>
                              <DownloadIcon />
                            </AnimatedButton>
                          </Tooltip>
                          <Tooltip title="Print Receipt">
                            <AnimatedButton size="small" onClick={() => handlePrintReceipt(payment)} sx={{ ml: 1 }}>
                              <PrintIcon />
                            </AnimatedButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <AnimatedButton size="small" onClick={() => handleEditPayment(payment)} sx={{ ml: 1 }}>
                              <EditIcon />
                            </AnimatedButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <AnimatedButton size="small" color="error" onClick={() => handleDeletePayment(payment)} sx={{ ml: 1 }}>
                              <DeleteIcon />
                            </AnimatedButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </motion.div>

        <PaymentFormDialog
          open={openFormDialog}
          onClose={() => setOpenFormDialog(false)}
          payment={selectedPayment}
          onSubmit={handleSubmitPayment}
          loading={loading}
        />

        <DeleteConfirmationDialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          onConfirm={handleConfirmDelete}
          payment={selectedPayment}
          loading={loading}
        />
      </Container>
    </PageTransition>
  );
};

export default PaymentTracking;