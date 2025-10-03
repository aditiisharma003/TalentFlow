// src/app/slices/assessmentsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as assessmentsApi from "../../api/assessmentsApi";

// Async thunks
export const fetchAssessment = createAsyncThunk("assessments/fetch", async (jobId) => {
  return await assessmentsApi.getAssessment(jobId);
});

export const saveAssessment = createAsyncThunk("assessments/save", async ({ jobId, data }) => {
  return await assessmentsApi.saveAssessment(jobId, data);
});

export const submitAssessment = createAsyncThunk("assessments/submit", async ({ jobId, response }) => {
  return await assessmentsApi.submitAssessment(jobId, response);
});

const assessmentsSlice = createSlice({
  name: "assessments",
  initialState: {
    items: {}, // { [jobId]: assessmentData }
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchAssessment
      .addCase(fetchAssessment.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAssessment.fulfilled, (state, action) => {
        state.items[action.meta.arg] = action.payload;
        state.loading = false;
      })
      .addCase(fetchAssessment.rejected, (state, action) => { state.error = action.error.message; state.loading = false; })

      // saveAssessment
      .addCase(saveAssessment.fulfilled, (state, action) => {
        state.items[action.meta.arg.jobId] = action.payload;
      })

      // submitAssessment
      .addCase(submitAssessment.fulfilled, (state, action) => {
        // Optionally mark as submitted or store response
        state.items[action.meta.arg.jobId].submitted = true;
      });
  },
});

export default assessmentsSlice.reducer;
