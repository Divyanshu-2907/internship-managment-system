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
const DocumentCard = ({ document, onPreview, onDownload, onDelete, onShare }) => {
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
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <DocumentIcon sx={{ mr: 1, color: 'primary.main' }} />
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
          />
          <Chip
            icon={getStatusIcon(document.status)}
            label={document.status}
            size="small"
            color={getStatusColor(document.status)}
          />
        </Box>
        <Typography variant="caption" color="text.secondary">
          Uploaded: {new Date(document.uploadDate).toLocaleDateString()}
        </Typography>
      </CardContent>
      <CardActions>
        <Tooltip title="Preview">
          <IconButton size="small" onClick={() => onPreview(document)}>
            <PreviewIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Download">
          <IconButton size="small" onClick={() => onDownload(document)}>
            <DownloadIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Share">
          <IconButton size="small" onClick={() => onShare(document)}>
            <ShareIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            size="small"
            color="error"
            onClick={() => onDelete(document)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Upload Document</DialogTitle>
      <Formik
        initialValues={initialValues}
        validationSchema={documentSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched, setFieldValue, isSubmitting }) => (
          <Form>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field name="title">
                    {({ field, form }) => (
                      <TextField
                        {...field}
                        label="Title"
                        fullWidth
                        error={touched.title && errors.title}
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
                        error={touched.category && errors.category}
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
                        error={touched.description && errors.description}
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
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<UploadIcon />}
                      fullWidth
                    >
                      Choose File
                    </Button>
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
              <Button onClick={onClose}>Cancel</Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting || loading}
                startIcon={loading && <CircularProgress size={20} />}
              >
                Upload
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

// Delete Confirmation Dialog Component
const DeleteConfirmationDialog = ({ open, onClose, onConfirm, document, loading }) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle>Delete Document</DialogTitle>
    <DialogContent>
      <Typography>
        Are you sure you want to delete "{document?.title}"? This action cannot be
        undone.
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

// Share Document Dialog Component
const ShareDocumentDialog = ({ open, onClose, onShare, document, loading }) => {
  const [email, setEmail] = useState('');

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Share Document</DialogTitle>
      <DialogContent>
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
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => onShare(document, email)}
          variant="contained"
          disabled={!email || loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          Share
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Documents = () => {
  const { mode } = useTheme();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Fetch documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const response = await new Promise((resolve) =>
        setTimeout(() => resolve({ data: mockDocuments }), 1000)
      );
      setDocuments(response.data);
    } catch (error) {
      toast.error('Failed to fetch documents');
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
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

  return (
    <Box sx={{ p: 3 }}>
      {loading && <LinearProgress sx={{ mb: 2 }} />}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Documents</Typography>
        <Box>
          <Tooltip title="Refresh">
            <IconButton onClick={fetchDocuments} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenUploadDialog(true)}
            sx={{ ml: 2 }}
          >
            Upload Document
          </Button>
        </Box>
      </Box>

      {/* Document Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Total Documents
              </Typography>
              <Typography variant="h4">{documentStats.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="success.main" gutterBottom>
                Approved
              </Typography>
              <Typography variant="h4" color="success.main">
                {documentStats.approved}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="warning.main" gutterBottom>
                Pending
              </Typography>
              <Typography variant="h4" color="warning.main">
                {documentStats.pending}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="error.main" gutterBottom>
                Rejected
              </Typography>
              <Typography variant="h4" color="error.main">
                {documentStats.rejected}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filter}
                label="Status"
                onChange={(e) => setFilter(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                {Object.entries(DOCUMENT_STATUS).map(([key, value]) => (
                  <MenuItem key={value} value={value}>
                    {key.charAt(0) + key.slice(1).toLowerCase()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {Object.entries(DOCUMENT_CATEGORIES).map(([key, value]) => (
                  <MenuItem key={value} value={value}>
                    {key.charAt(0) + key.slice(1).toLowerCase()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Document Grid */}
      <Grid container spacing={3}>
        {filteredDocuments.map((document) => (
          <Grid item xs={12} sm={6} md={4} key={document.id}>
            <DocumentCard
              document={document}
              onPreview={handlePreviewDocument}
              onDownload={handleDownloadDocument}
              onDelete={() => {
                setSelectedDocument(document);
                setOpenDeleteDialog(true);
              }}
              onShare={() => {
                setSelectedDocument(document);
                setOpenShareDialog(true);
              }}
            />
          </Grid>
        ))}
        {filteredDocuments.length === 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">
                No documents found
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Upload Dialog */}
      <DocumentUploadDialog
        open={openUploadDialog}
        onClose={() => setOpenUploadDialog(false)}
        onSubmit={handleUploadDocument}
        loading={loading}
      />

      {/* Delete Dialog */}
      <DeleteConfirmationDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDeleteDocument}
        document={selectedDocument}
        loading={loading}
      />

      {/* Share Dialog */}
      <ShareDocumentDialog
        open={openShareDialog}
        onClose={() => setOpenShareDialog(false)}
        onShare={handleShareDocument}
        document={selectedDocument}
        loading={loading}
      />
    </Box>
  );
};

// Mock data - replace with actual API data
const mockDocuments = [
  {
    id: '1',
    title: 'Internship Contract',
    category: DOCUMENT_CATEGORIES.CONTRACT,
    description: 'Signed internship agreement',
    status: DOCUMENT_STATUS.APPROVED,
    uploadDate: '2024-03-01',
  },
  {
    id: '2',
    title: 'Resume',
    category: DOCUMENT_CATEGORIES.RESUME,
    description: 'Updated resume with latest experience',
    status: DOCUMENT_STATUS.PENDING,
    uploadDate: '2024-03-15',
  },
  {
    id: '3',
    title: 'Performance Evaluation',
    category: DOCUMENT_CATEGORIES.EVALUATION,
    description: 'Mid-term performance review',
    status: DOCUMENT_STATUS.REJECTED,
    uploadDate: '2024-03-20',
  },
];

export default Documents; 