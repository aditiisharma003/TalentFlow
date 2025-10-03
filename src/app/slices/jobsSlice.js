// src/app/slices/jobsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as jobsApi from "../../api/jobsApi";

// --- Async thunks ---
export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async (_, { rejectWithValue }) => {
    try {
      return await jobsApi.getAllJobs();
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch jobs");
    }
  }
);

export const createJob = createAsyncThunk(
  "jobs/createJob",
  async (job, { rejectWithValue }) => {
    try {
      return await jobsApi.createJob(job);
    } catch (err) {
      return rejectWithValue(err.message || "Failed to create job");
    }
  }
);

export const updateJob = createAsyncThunk(
  "jobs/updateJob",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await jobsApi.updateJob(id, data);
    } catch (err) {
      return rejectWithValue(err.message || "Failed to update job");
    }
  }
);

export const deleteJob = createAsyncThunk(
  "jobs/deleteJob",
  async (id, { rejectWithValue }) => {
    try {
      return await jobsApi.deleteJob(id);
    } catch (err) {
      return rejectWithValue(err.message || "Failed to delete job");
    }
  }
);

export const reorderJob = createAsyncThunk(
  "jobs/reorderJob",
  async ({ fromOrder, toOrder }, { rejectWithValue }) => {
    try {
      return await jobsApi.reorderJob({ fromOrder, toOrder });
    } catch (err) {
      return rejectWithValue(err.message || "Failed to reorder jobs");
    }
  }
);

// --- Slice ---
const jobsSlice = createSlice({
  name: "jobs",
  initialState: {
    items: [],
    loading: false,
    error: null,
    loaded: false, // ✅ whether we’ve fetched at least once
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- FETCH JOBS ---
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        // ⚠️ do not clear error immediately, let UI show until success
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.error = null;
        state.loaded = true;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error.message || "Failed to fetch jobs";
        state.loaded = true;
      })

      // --- CREATE JOB ---
      .addCase(createJob.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      // --- UPDATE JOB ---
      .addCase(updateJob.fulfilled, (state, action) => {
        const idx = state.items.findIndex((j) => j.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })

      // --- REORDER JOB ---
      .addCase(reorderJob.fulfilled, (state, action) => {
        state.items = action.payload; // backend returns reordered list
      })

      // --- DELETE JOB ---
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.items = state.items.filter((j) => j.id !== action.payload.id);
      });
  },
});

export default jobsSlice.reducer;
