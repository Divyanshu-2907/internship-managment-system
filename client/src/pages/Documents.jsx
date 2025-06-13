import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
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
  Chip,
  IconButton,
  Tooltip,
  Alert,
  LinearProgress,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Badge,
  Container,
} from '@mui/material';
import {
  Description as DocumentIcon,
  Download as DownloadIcon,
  Preview as PreviewIcon,
  Email as EmailIcon,
  Print as PrintIcon,
  Delete as DeleteIcon,
  Upload as UploadIcon,
  Share as ShareIcon,
  Folder as FolderIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';

import AnimatedCard from '../components/AnimatedCard';
import AnimatedButton from '../components/AnimatedButton';
import AnimatedIcon from '../components/AnimatedIcon';
import PageTransition from '../components/PageTransition';
import LoadingSpinner from '../components/LoadingSpinner';

// Document categories
const DOCUMENT_CATEGORIES = {
  CONTRACT: 'contract',
  RESUME: 'resume',
  CERTIFICATE: 'certificate',
  EVALUATION: 'evaluation',
  OTHER: 'other',
};

// Document status
const DOCUMENT_STATUS = {
  APPROVED: 'approved',
  PENDING: 'pending',
  REJECTED: 'rejected',
};

// Validation schema for document form
const documentSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  category: Yup.string().required('Category is required'),
  description: Yup.string().required('Description is required'),
  file: Yup.mixed().required('File is required'),
});

// Document Card Component
const DocumentCard = ({ document, onPreview, onDownload, onDelete, onShare, delay }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case DOCUMENT_STATUS.APPROVED:
        return 'success';
      case DOCUMENT_STATUS.PENDING:
        return 'warning';
      case DOCUMENT_STATUS.REJECTED:
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case DOCUMENT_STATUS.APPROVED:
        return <CheckCircleIcon color="success" />;
      case DOCUMENT_STATUS.PENDING:
        return <WarningIcon color="warning" />;
      case DOCUMENT_STATUS.REJECTED:
        return <ErrorIcon color="error" />;
      default:
        return null;
    }
  };

  return (
    <AnimatedCard delay={delay}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AnimatedIcon>
            <DocumentIcon sx={{ mr: 1, color: 'primary.main' }} />
          </AnimatedIcon>
          <Typography variant="h6" noWrap>
            {document.title}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {document.description}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Chip
            label={document.category}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
          <Chip
            icon={getStatusIcon(document.status)}
            label={document.status}
            size="small"
            color={getStatusColor(document.status)}
            sx={{ fontWeight: 600 }}
          />
        </Box>
        <Typography variant="caption" color="text.secondary">
          Uploaded: {new Date(document.uploadDate).toLocaleDateString()}
        </Typography>
      </CardContent>
      <CardActions>
        <Tooltip title="Preview">
          <AnimatedButton size="small" onClick={() => onPreview(document)}>
            <PreviewIcon />
          </AnimatedButton>
        </Tooltip>
        <Tooltip title="Download">
          <AnimatedButton size="small" onClick={() => onDownload(document)}>
            <DownloadIcon />
          </AnimatedButton>
        </Tooltip>
        <Tooltip title="Share">
          <AnimatedButton size="small" onClick={() => onShare(document)}>
            <ShareIcon />
          </AnimatedButton>
        </Tooltip>
        <Tooltip title="Delete">
          <AnimatedButton
            size="small"
            color="error"
            onClick={() => onDelete(document)}
          >
            <DeleteIcon />
          </AnimatedButton>
        </Tooltip>
      </CardActions>
    </AnimatedCard>
  );
};

// Document Upload Dialog Component
const DocumentUploadDialog = ({ open, onClose, onSubmit, loading }) => {
  const initialValues = {
    title: '',
    category: DOCUMENT_CATEGORIES.OTHER,
    description: '',
    file: null,
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
        <Typography variant="h6" fontWeight={600}>Upload Document</Typography>
      </DialogTitle>
      <Formik
        initialValues={initialValues}
        validationSchema={documentSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched, setFieldValue, isSubmitting }) => (
          <Form>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field name="title">
                    {({ field, form }) => (
                      <TextField
                        {...field}
                        label="Title"
                        fullWidth
                        error={touched.title && Boolean(errors.title)}
                        helperText={touched.title && errors.title}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid item xs={12}>
                  <Field name="category">
                    {({ field, form }) => (
                      <FormControl
                        fullWidth
                        error={touched.category && Boolean(errors.category)}
                      >
                        <InputLabel>Category</InputLabel>
                        <Select {...field} label="Category">
                          {Object.entries(DOCUMENT_CATEGORIES).map(([key, value]) => (
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
                        error={touched.description && Boolean(errors.description)}
                        helperText={touched.description && errors.description}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid item xs={12}>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    style={{ display: 'none' }}
                    id="document-upload"
                    onChange={(event) => {
                      setFieldValue('file', event.currentTarget.files[0]);
                    }}
                  />
                  <label htmlFor="document-upload">
                    <AnimatedButton
                      variant="outlined"
                      component="span"
                      startIcon={<UploadIcon />}
                      fullWidth
                    >
                      {values.file ? values.file.name : 'Choose File'}
                    </AnimatedButton>
                  </label>
                  {touched.file && errors.file && (
                    <Typography color="error" variant="caption">
                      {errors.file}
                    </Typography>
                  )}
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
                Upload
              </AnimatedButton>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

// Delete Confirmation Dialog Component
const DeleteConfirmationDialog = ({ open, onClose, onConfirm, document, loading }) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
    PaperProps={{
      component: motion.div,
      initial: { opacity: 0, scale: 0.9, y: 50 },
      animate: { opacity: 1, scale: 1, y: 0 },
      transition: { duration: 0.3 },
    }}
  >
    <DialogTitle>
      <Typography variant="h6" fontWeight={600}>Delete Document</Typography>
    </DialogTitle>
    <DialogContent dividers>
      <Typography>
        Are you sure you want to delete "{document?.title}"? This action cannot be
        undone.
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

// Share Document Dialog Component
const ShareDocumentDialog = ({ open, onClose, onShare, document, loading }) => {
  const [email, setEmail] = useState('');

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
      PaperProps={{
        component: motion.div,
        initial: { opacity: 0, scale: 0.9, y: 50 },
        animate: { opacity: 1, scale: 1, y: 0 },
        transition: { duration: 0.3 },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" fontWeight={600}>Share Document</Typography>
      </DialogTitle>
      <DialogContent dividers>
        <TextField
          label="Email Address"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <AnimatedButton onClick={onClose}>Cancel</AnimatedButton>
        <AnimatedButton
          onClick={() => onShare(document, email)}
          variant="contained"
          disabled={!email || loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          Share
        </AnimatedButton>
      </DialogActions>
    </Dialog>
  );
};

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

// Mock data (for demonstration)
const mockDocuments = [
  {
    id: '1',
    title: 'Internship Contract',
    category: DOCUMENT_CATEGORIES.CONTRACT,
    description: 'Official internship agreement document.',
    uploadDate: '2023-01-15T10:00:00Z',
    status: DOCUMENT_STATUS.APPROVED,
    fileUrl: '/documents/contract.pdf',
  },
  {
    id: '2',
    title: 'Resume - John Doe',
    category: DOCUMENT_CATEGORIES.RESUME,
    description: 'Updated resume for job applications.',
    uploadDate: '2023-02-20T14:30:00Z',
    status: DOCUMENT_STATUS.PENDING,
    fileUrl: '/documents/resume.pdf',
  },
  {
    id: '3',
    title: 'Q1 Performance Evaluation',
    category: DOCUMENT_CATEGORIES.EVALUATION,
    description: 'Quarterly performance review document.',
    uploadDate: '2023-03-01T09:00:00Z',
    status: DOCUMENT_STATUS.APPROVED,
    fileUrl: '/documents/evaluation_q1.pdf',
  },
  {
    id: '4',
    title: 'Project X Report',
    category: DOCUMENT_CATEGORIES.OTHER,
    description: 'Final report for Project X development.',
    uploadDate: '2023-04-10T11:45:00Z',
    status: DOCUMENT_STATUS.REJECTED,
    fileUrl: '/documents/project_x_report.pdf',
  },
  {
    id: '5',
    title: 'Certification - React Dev',
    category: DOCUMENT_CATEGORIES.CERTIFICATE,
    description: 'Certificate of completion for React development course.',
    uploadDate: '2023-05-01T16:00:00Z',
    status: DOCUMENT_STATUS.APPROVED,
    fileUrl: '/documents/react_cert.pdf',
  },
];

const Documents = () => {
  const { mode } = useTheme();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState(mockDocuments); // Use mock data initially
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  // Fetch documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setRefreshing(true);
      // TODO: Replace with actual API call
      const response = await new Promise((resolve) =>
        setTimeout(() => resolve({ data: mockDocuments }), 1000)
      );
      setDocuments(response.data);
    } catch (error) {
      toast.error('Failed to fetch documents');
      console.error('Error fetching documents:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleUploadDocument = async (values, { resetForm }) => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const newDocument = {
        id: Date.now().toString(),
        ...values,
        uploadDate: new Date().toISOString(),
        status: DOCUMENT_STATUS.PENDING,
      };
      
      setDocuments([...documents, newDocument]);
      toast.success('Document uploaded successfully');
      setOpenUploadDialog(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to upload document');
      console.error('Error uploading document:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setDocuments(documents.filter(d => d.id !== selectedDocument.id));
      toast.success('Document deleted successfully');
      setOpenDeleteDialog(false);
    } catch (error) {
      toast.error('Failed to delete document');
      console.error('Error deleting document:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShareDocument = async (document, email) => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success(`Document shared with ${email}`);
      setOpenShareDialog(false);
    } catch (error) {
      toast.error('Failed to share document');
      console.error('Error sharing document:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewDocument = (document) => {
    // TODO: Implement document preview
    toast.info('Document preview coming soon');
  };

  const handleDownloadDocument = (document) => {
    // TODO: Implement document download
    toast.info('Document download coming soon');
  };

  const filteredDocuments = documents.filter(document => {
    const statusMatch = filter === 'all' || document.status === filter;
    const categoryMatch = categoryFilter === 'all' || document.category === categoryFilter;
    return statusMatch && categoryMatch;
  });

  const documentStats = {
    total: documents.length,
    approved: documents.filter(d => d.status === DOCUMENT_STATUS.APPROVED).length,
    pending: documents.filter(d => d.status === DOCUMENT_STATUS.PENDING).length,
    rejected: documents.filter(d => d.status === DOCUMENT_STATUS.REJECTED).length,
  };

  if (loading && !refreshing) {
    return <LoadingSpinner message="Loading documents..." />;
  }

  return (
    <PageTransition>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box>
          <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
            Documents
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage all your internship-related documents
          </Typography>
        </Box>
      </motion.div>

      {/* Document Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Documents"
            value={documentStats.total}
            icon={<DocumentIcon />}
            color="primary"
            delay={0.1}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Approved"
            value={documentStats.approved}
            icon={<CheckCircleIcon />}
            color="success"
            delay={0.2}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Pending"
            value={documentStats.pending}
            icon={<WarningIcon />}
            color="warning"
            delay={0.3}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Rejected"
            value={documentStats.rejected}
            icon={<ErrorIcon />}
            color="error"
            delay={0.4}
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
              startIcon={<UploadIcon />}
              onClick={() => setOpenUploadDialog(true)}
              delay={0.6}
            >
              Upload Document
            </AnimatedButton>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Tooltip title="Refresh">
                <IconButton onClick={fetchDocuments} disabled={refreshing}>
                  {refreshing ? <CircularProgress size={20} /> : <RefreshIcon />}
                </IconButton>
              </Tooltip>
            </motion.div>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filter}
                label="Status"
                onChange={(e) => setFilter(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                {Object.values(DOCUMENT_STATUS).map((status) => (
                  <MenuItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                {Object.values(DOCUMENT_CATEGORIES).map((category) => (
                  <MenuItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </motion.div>

      {/* Document List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <Grid container spacing={3}>
          {filteredDocuments.length === 0 && !loading && (
            <Grid item xs={12}>
              <Alert severity="info">No documents found matching your criteria.</Alert>
            </Grid>
          )}
          {filteredDocuments.map((doc, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={doc.id}>
              <DocumentCard
                document={doc}
                onPreview={handlePreviewDocument}
                onDownload={handleDownloadDocument}
                onDelete={(d) => {
                  setSelectedDocument(d);
                  setOpenDeleteDialog(true);
                }}
                onShare={(d) => {
                  setSelectedDocument(d);
                  setOpenShareDialog(true);
                }}
                delay={0.1 + index * 0.05}
              />
            </Grid>
          ))}
        </Grid>
      </motion.div>

      {/* Dialogs */}
      <DocumentUploadDialog
        open={openUploadDialog}
        onClose={() => setOpenUploadDialog(false)}
        onSubmit={handleUploadDocument}
        loading={loading}
      />

      <DeleteConfirmationDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDeleteDocument}
        document={selectedDocument}
        loading={loading}
      />

      <ShareDocumentDialog
        open={openShareDialog}
        onClose={() => setOpenShareDialog(false)}
        onShare={handleShareDocument}
        document={selectedDocument}
        loading={loading}
      />
    </PageTransition>
  );
};

export default Documents; 