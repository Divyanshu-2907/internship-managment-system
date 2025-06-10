import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Tooltip,
  Box,
  Typography,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CompletedIcon,
  Pending as PendingIcon,
  Timeline as InProgressIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

const getStatusIcon = (status) => {
  switch (status) {
    case 'completed':
      return <CompletedIcon color="success" />;
    case 'in_progress':
      return <InProgressIcon color="primary" />;
    default:
      return <PendingIcon color="warning" />;
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high':
      return 'error';
    case 'medium':
      return 'warning';
    default:
      return 'success';
  }
};

const TaskList = ({
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  if (tasks.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No tasks found
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Assigned To</TableCell>
            <TableCell>Start Date</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>{task.title}</TableCell>
              <TableCell>{task.internId}</TableCell>
              <TableCell>
                {format(new Date(task.startDate), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell>
                {format(new Date(task.dueDate), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell>
                <Chip
                  label={task.priority}
                  color={getPriorityColor(task.priority)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Tooltip title={task.status}>
                  <IconButton
                    size="small"
                    onClick={() => {
                      const nextStatus = {
                        pending: 'in_progress',
                        in_progress: 'completed',
                        completed: 'pending',
                      };
                      onStatusChange(task.id, nextStatus[task.status]);
                    }}
                  >
                    {getStatusIcon(task.status)}
                  </IconButton>
                </Tooltip>
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Edit">
                  <IconButton size="small" onClick={() => onEdit(task)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    onClick={() => onDelete(task.id)}
                    color="error"
                  >
                    <DeleteIcon />
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

export default TaskList; 