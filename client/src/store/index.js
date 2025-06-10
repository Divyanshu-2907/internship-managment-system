import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import taskReducer from './slices/taskSlice';
import internReducer from './slices/internSlice';
import authReducer from './slices/authSlice';
import timelineReducer from './slices/timelineSlice';

export const store = configureStore({
  reducer: {
    task: taskReducer,
    intern: internReducer,
    auth: authReducer,
    timeline: timelineReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['task/setCurrentTask', 'intern/setCurrentIntern', 'timeline/setCurrentMilestone'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.startDate', 'payload.endDate', 'payload.dueDate', 'payload.date'],
        // Ignore these paths in the state
        ignoredPaths: ['task.currentTask', 'intern.currentIntern', 'timeline.currentMilestone'],
      },
    }),
});

// Export the store's state type
export const RootState = store.getState;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector; 