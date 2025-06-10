import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks for timeline operations
export const fetchTimeline = createAsyncThunk(
  'timeline/fetchTimeline',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/timeline');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch timeline');
    }
  }
);

export const addMilestone = createAsyncThunk(
  'timeline/addMilestone',
  async (milestone, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/timeline/milestones', milestone);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add milestone');
    }
  }
);

export const updateMilestone = createAsyncThunk(
  'timeline/updateMilestone',
  async ({ id, milestone }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/timeline/milestones/${id}`, milestone);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update milestone');
    }
  }
);

export const deleteMilestone = createAsyncThunk(
  'timeline/deleteMilestone',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/timeline/milestones/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete milestone');
    }
  }
);

// Initial state
const initialState = {
  milestones: [],
  loading: false,
  error: null,
};

// Timeline slice
const timelineSlice = createSlice({
  name: 'timeline',
  initialState,
  reducers: {
    clearTimelineError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch timeline
      .addCase(fetchTimeline.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTimeline.fulfilled, (state, action) => {
        state.loading = false;
        state.milestones = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchTimeline.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add milestone
      .addCase(addMilestone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMilestone.fulfilled, (state, action) => {
        state.loading = false;
        state.milestones.push(action.payload);
      })
      .addCase(addMilestone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update milestone
      .addCase(updateMilestone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMilestone.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.milestones.findIndex(m => m.id === action.payload.id);
        if (index !== -1) {
          state.milestones[index] = action.payload;
        }
      })
      .addCase(updateMilestone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete milestone
      .addCase(deleteMilestone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMilestone.fulfilled, (state, action) => {
        state.loading = false;
        state.milestones = state.milestones.filter(m => m.id !== action.payload);
      })
      .addCase(deleteMilestone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTimelineError } = timelineSlice.actions;

// Export the reducer as default
const timelineReducer = timelineSlice.reducer;
export default timelineReducer; 