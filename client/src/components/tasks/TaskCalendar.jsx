import React from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Box, Paper, Typography } from '@mui/material';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const TaskCalendar = ({ tasks, onSelectTask }) => {
  const events = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    start: new Date(task.startDate),
    end: new Date(task.dueDate),
    resource: task,
  }));

  const eventStyleGetter = (event) => {
    const task = event.resource;
    let backgroundColor = '#e3f2fd'; // default color

    switch (task.priority) {
      case 'high':
        backgroundColor = '#ffebee';
        break;
      case 'medium':
        backgroundColor = '#fff3e0';
        break;
      case 'low':
        backgroundColor = '#e8f5e9';
        break;
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: '#000',
        border: '0px',
        display: 'block',
      },
    };
  };

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
    <Paper sx={{ p: 2, height: 'calc(100vh - 200px)' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={(event) => {
          const task = event.resource;
          onSelectTask(task);
        }}
        views={['month', 'week', 'day']}
        defaultView="month"
        popup
        selectable
      />
    </Paper>
  );
};

export default TaskCalendar; 