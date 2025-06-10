import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useAppSelector } from '../../store';

const validationSchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  internId: yup.string().required('Intern assignment is required'),
  startDate: yup.date().required('Start date is required'),
  dueDate: yup.date()
    .required('Due date is required')
    .min(yup.ref('startDate'), 'Due date must be after start date'),
  priority: yup.string().required('Priority is required'),
});

const TaskForm = ({
  open,
  onClose,
  onSubmit,
  initialValues,
  title,
}) => {
  const { interns } = useAppSelector((state) => state.intern);

  const formik = useFormik({
    initialValues: {
      title: initialValues?.title || '',
      description: initialValues?.description || '',
      internId: initialValues?.internId || '',
      startDate: initialValues?.startDate ? new Date(initialValues.startDate) : null,
      dueDate: initialValues?.dueDate ? new Date(initialValues.dueDate) : null,
      priority: initialValues?.priority || 'medium',
      status: initialValues?.status || 'pending',
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit({
        ...values,
        startDate: values.startDate?.toISOString() || '',
        dueDate: values.dueDate?.toISOString() || '',
      });
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="title"
                name="title"
                label="Title"
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
            </Grid>
            <Grid item xs={12}>
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
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="intern-label">Assign Intern</InputLabel>
                <Select
                  labelId="intern-label"
                  id="internId"
                  name="internId"
                  value={formik.values.internId}
                  onChange={formik.handleChange}
                  error={formik.touched.internId && Boolean(formik.errors.internId)}
                  label="Assign Intern"
                >
                  {interns.map((intern) => (
                    <MenuItem key={intern.id} value={intern.id}>
                      {intern.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="priority-label">Priority</InputLabel>
                <Select
                  labelId="priority-label"
                  id="priority"
                  name="priority"
                  value={formik.values.priority}
                  onChange={formik.handleChange}
                  error={formik.touched.priority && Boolean(formik.errors.priority)}
                  label="Priority"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Start Date"
                value={formik.values.startDate}
                onChange={(date) => formik.setFieldValue('startDate', date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: formik.touched.startDate && Boolean(formik.errors.startDate),
                    helperText: formik.touched.startDate && formik.errors.startDate,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Due Date"
                value={formik.values.dueDate}
                onChange={(date) => formik.setFieldValue('dueDate', date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: formik.touched.dueDate && Boolean(formik.errors.dueDate),
                    helperText: formik.touched.dueDate && formik.errors.dueDate,
                  },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {initialValues ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskForm; 