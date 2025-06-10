import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const fetchInterns = createAsyncThunk(
  'intern/fetchInterns',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/interns');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch interns');
    }
  }
);

export const fetchInternProfile = createAsyncThunk(
  'intern/fetchInternProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/intern/profile');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch intern profile');
    }
  }
);

export const updateInternProfile = createAsyncThunk(
  'intern/updateInternProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axios.put('/api/intern/profile', profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update intern profile');
    }
  }
);

const initialState = {
  interns: [],
  currentIntern: null,
  loading: false,
  error: null,
};

const internSlice = createSlice({
  name: 'intern',
  initialState,
  reducers: {
    setCurrentIntern: (state, action) => {
      state.currentIntern = action.payload;
    },
    updateIntern: (state, action) => {
      const index = state.interns.findIndex(intern => intern.id === action.payload.id);
      if (index !== -1) {
        state.interns[index] = action.payload;
      }
      if (state.currentIntern?.id === action.payload.id) {
        state.currentIntern = action.payload;
      }
    },
    addIntern: (state, action) => {
      state.interns.push(action.payload);
    },
    removeIntern: (state, action) => {
      state.interns = state.interns.filter(intern => intern.id !== action.payload);
      if (state.currentIntern?.id === action.payload) {
        state.currentIntern = null;
      }
    },
    clearInternError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Interns
      .addCase(fetchInterns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInterns.fulfilled, (state, action) => {
        state.loading = false;
        state.interns = action.payload;
      })
      .addCase(fetchInterns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Intern Profile
      .addCase(fetchInternProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInternProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentIntern = action.payload;
      })
      .addCase(fetchInternProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Intern Profile
      .addCase(updateInternProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInternProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentIntern = action.payload;
        const index = state.interns.findIndex(intern => intern.id === action.payload.id);
        if (index !== -1) {
          state.interns[index] = action.payload;
        }
      })
      .addCase(updateInternProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setCurrentIntern,
  updateIntern,
  addIntern,
  removeIntern,
  clearInternError,
} = internSlice.actions;

export default internSlice.reducer; 