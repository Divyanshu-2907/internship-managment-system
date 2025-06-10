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
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

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

// Summary Card Component
const SummaryCard = ({ title, value, icon: Icon, color, subtitle }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Icon sx={{ mr: 1, color: `${color}.main` }} />
        <Typography variant="h6">{title}</Typography>
      </Box>
      <Typography variant="h4" color={`${color}.main`}>
        ${value}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{payment ? 'Edit Payment' : 'Add Payment'}</DialogTitle>
      <Formik
        initialValues={initialValues}
        validationSchema={paymentSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Field name="date">
                    {({ field, form }) => (
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="Date"
                          value={field.value}
                          onChange={(date) => form.setFieldValue('date', date)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              error={touched.date && errors.date}
                              helperText={touched.date && errors.date}
                            />
                          )}
                        />
                      </LocalizationProvider>
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
                        error={touched.amount && errors.amount}
                        helperText={touched.amount && errors.amount}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field name="type">
                    {({ field, form }) => (
                      <FormControl fullWidth error={touched.type && errors.type}>
                        <InputLabel>Type</InputLabel>
                        <Select {...field} label="Type">
                          {Object.entries(PAYMENT_TYPES).map(([key, value]) => (
                            <MenuItem key={value} value={value}>
                              {key.charAt(0) + key.slice(1).toLowerCase()}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  </Field>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field name="status">
                    {({ field, form }) => (
                      <FormControl fullWidth error={touched.status && errors.status}>
                        <InputLabel>Status</InputLabel>
                        <Select {...field} label="Status">
                          {Object.entries(PAYMENT_STATUS).map(([key, value]) => (
                            <MenuItem key={value} value={value}>
                              {key.charAt(0) + key.slice(1).toLowerCase()}
                            </MenuItem>
                          ))}
                        </Select>
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
                        error={touched.description && errors.description}
                        helperText={touched.description && errors.description}
                      />
                    )}
                  </Field>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>Cancel</Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting || loading}
                startIcon={loading && <CircularProgress size={20} />}
              >
                {payment ? 'Update' : 'Add'} Payment
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

// Delete Confirmation Dialog Component
const DeleteConfirmationDialog = ({ open, onClose, onConfirm, payment, loading }) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle>Delete Payment</DialogTitle>
    <DialogContent>
      <Typography>
        Are you sure you want to delete the payment for {payment?.description}?
        This action cannot be undone.
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button
        onClick={onConfirm}
        color="error"
        variant="contained"
        disabled={loading}
        startIcon={loading && <CircularProgress size={20} />}
      >
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);

const PaymentTracking = () => {
  const { mode } = useTheme();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState([]);
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [filter, setFilter] = useState('all');

  // Fetch payments on component mount
  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const response = await new Promise((resolve) =>
        setTimeout(() => resolve({ data: mockPayments }), 1000)
      );
      setPayments(response.data);
    } catch (error) {
      toast.error('Failed to fetch payments');
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
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
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      if (selectedPayment) {
        setPayments(payments.map(p => 
          p.id === selectedPayment.id ? { ...p, ...values } : p
        ));
        toast.success('Payment updated successfully');
      } else {
        setPayments([...payments, { id: Date.now().toString(), ...values }]);
        toast.success('Payment added successfully');
      }
      
      setOpenFormDialog(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save payment');
      console.error('Error saving payment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setPayments(payments.filter(p => p.id !== selectedPayment.id));
      toast.success('Payment deleted successfully');
      setOpenDeleteDialog(false);
    } catch (error) {
      toast.error('Failed to delete payment');
      console.error('Error deleting payment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = (payment) => {
    // TODO: Implement receipt download
    toast.info('Receipt download coming soon');
  };

  const handlePrintReceipt = (payment) => {
    // TODO: Implement receipt printing
    toast.info('Receipt printing coming soon');
  };

  const filteredPayments = payments.filter(payment => {
    if (filter === 'all') return true;
    return payment.status === filter;
  });

  const totalPaid = payments
    .filter((p) => p.status === PAYMENT_STATUS.PAID)
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payments
    .filter((p) => p.status === PAYMENT_STATUS.PENDING)
    .reduce((sum, p) => sum + p.amount, 0);

  const nextPayment = payments
    .filter((p) => p.status === PAYMENT_STATUS.PENDING)
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

  return (
    <Box sx={{ p: 3 }}>
      {loading && <LinearProgress sx={{ mb: 2 }} />}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Payment Tracking</Typography>
        <Box>
          <Tooltip title="Refresh">
            <IconButton onClick={fetchPayments} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddPayment}
            sx={{ ml: 2 }}
          >
            Add Payment
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <SummaryCard
            title="Total Paid"
            value={totalPaid}
            icon={MoneyIcon}
            color="success"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <SummaryCard
            title="Pending Payments"
            value={totalPending}
            icon={PaymentIcon}
            color="warning"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <SummaryCard
            title="Next Payment"
            value={nextPayment?.amount || 0}
            icon={ReceiptIcon}
            color="info"
            subtitle={nextPayment ? `${new Date(nextPayment.date).toLocaleDateString()} (${nextPayment.type})` : 'No pending payments'}
          />
        </Grid>

        {/* Payment History */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h5">Payment History</Typography>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Filter</InputLabel>
                <Select
                  value={filter}
                  label="Filter"
                  onChange={(e) => setFilter(e.target.value)}
                  startAdornment={<FilterIcon sx={{ mr: 1 }} />}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value={PAYMENT_STATUS.PAID}>Paid</MenuItem>
                  <MenuItem value={PAYMENT_STATUS.PENDING}>Pending</MenuItem>
                  <MenuItem value={PAYMENT_STATUS.OVERDUE}>Overdue</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                      <TableCell>{payment.description}</TableCell>
                      <TableCell>
                        <Chip
                          label={payment.type}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">${payment.amount}</TableCell>
                      <TableCell>
                        <Chip
                          label={payment.status}
                          color={
                            payment.status === PAYMENT_STATUS.PAID
                              ? 'success'
                              : payment.status === PAYMENT_STATUS.PENDING
                              ? 'warning'
                              : 'error'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Download Receipt">
                          <IconButton
                            size="small"
                            onClick={() => handleDownloadReceipt(payment)}
                          >
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Print Receipt">
                          <IconButton
                            size="small"
                            onClick={() => handlePrintReceipt(payment)}
                          >
                            <PrintIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Payment">
                          <IconButton
                            size="small"
                            onClick={() => handleEditPayment(payment)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Payment">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeletePayment(payment)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredPayments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography color="text.secondary">
                          No payments found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Payment Form Dialog */}
      <PaymentFormDialog
        open={openFormDialog}
        onClose={() => setOpenFormDialog(false)}
        payment={selectedPayment}
        onSubmit={handleSubmitPayment}
        loading={loading}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        payment={selectedPayment}
        loading={loading}
      />
    </Box>
  );
};

// Mock data - replace with actual API data
const mockPayments = [
  {
    id: '1',
    date: '2024-03-01',
    amount: 1000,
    status: PAYMENT_STATUS.PAID,
    type: PAYMENT_TYPES.STIPEND,
    description: 'March Stipend',
  },
  {
    id: '2',
    date: '2024-04-01',
    amount: 1000,
    status: PAYMENT_STATUS.PENDING,
    type: PAYMENT_TYPES.STIPEND,
    description: 'April Stipend',
  },
  {
    id: '3',
    date: '2024-03-15',
    amount: 200,
    status: PAYMENT_STATUS.PAID,
    type: PAYMENT_TYPES.BONUS,
    description: 'Performance Bonus',
  },
];

export default PaymentTracking;