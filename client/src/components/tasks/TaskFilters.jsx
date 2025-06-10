import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  Search as SearchIcon,
  Sort as SortIcon,
  FilterList as FilterIcon,
  ViewList as ListIcon,
  CalendarMonth as CalendarIcon,
} from '@mui/icons-material';

function TaskFilters({
  filters,
  onFilterChange,
  onSortChange,
  onViewChange,
  currentView,
  sortBy,
  sortOrder,
}) {
  const handleSearchChange = (event) => {
    onFilterChange({ ...filters, search: event.target.value });
  };

  const handlePriorityFilterChange = (event) => {
    onFilterChange({
      ...filters,
      priority: event.target.value.split(','),
    });
  };

  const handleStatusFilterChange = (event) => {
    onFilterChange({
      ...filters,
      status: event.target.value.split(','),
    });
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      onSortChange(field, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      onSortChange(field, 'asc');
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search tasks..."
          value={filters.search || ''}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
          sx={{ flexGrow: 1 }}
        />

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            multiple
            value={filters.priority || []}
            onChange={handlePriorityFilterChange}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {(selected || []).map((value) => (
                  <Chip key={value} label={value} size="small" />
                ))}
              </Box>
            )}
          >
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="low">Low</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            multiple
            value={filters.status || []}
            onChange={handleStatusFilterChange}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {(selected || []).map((value) => (
                  <Chip key={value} label={value} size="small" />
                ))}
              </Box>
            )}
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="in_progress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>

        <Tooltip title="Sort by due date">
          <IconButton
            onClick={() => handleSortChange('dueDate')}
            color={sortBy === 'dueDate' ? 'primary' : 'default'}
          >
            <SortIcon />
          </IconButton>
        </Tooltip>

        <ToggleButtonGroup
          value={currentView}
          exclusive
          onChange={(_, value) => value && onViewChange(value)}
          size="small"
        >
          <ToggleButton value="list">
            <Tooltip title="List view">
              <ListIcon />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="calendar">
            <Tooltip title="Calendar view">
              <CalendarIcon />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>
    </Box>
  );
}

export default TaskFilters; 