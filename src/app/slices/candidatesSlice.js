// src/app/slices/candidatesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as candidatesApi from "../../api/candidatesApi";

// -----------------------------
// Async Thunks
// -----------------------------

// Fetch all candidates (pageSize=1000 to get all)
export const fetchCandidates = createAsyncThunk(
  "candidates/fetchCandidates",
  async () => {
    const res = await candidatesApi.getCandidates({ pageSize: 1000 });
    return res.results; // API returns {results, total, page, pageSize}
  }
);

// Create a new candidate
export const createCandidate = createAsyncThunk(
  "candidates/createCandidate",
  async (candidate) => {
    return await candidatesApi.addCandidate(candidate);
  }
);

// Update candidate stage
export const updateCandidateStage = createAsyncThunk(
  "candidates/updateCandidateStage",
  async ({ id, stage }) => {
    return await candidatesApi.moveCandidateStage(id, stage);
  }
);

// Fetch candidate timeline
export const fetchCandidateTimeline = createAsyncThunk(
  "candidates/fetchTimeline",
  async (id) => {
    return await candidatesApi.getCandidateTimeline(id);
  }
);

// Add note to candidate
export const addCandidateNote = createAsyncThunk(
  "candidates/addNote",
  async ({ id, note }) => {
    return await candidatesApi.addCandidateNote(id, note);
  }
);

// -----------------------------
// Slice
// -----------------------------
const candidatesSlice = createSlice({
  name: "candidates",
  initialState: {
    items: [],
    timeline: {}, // { candidateId: [...] }
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCandidates
      .addCase(fetchCandidates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidates.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchCandidates.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })

      // createCandidate
      .addCase(createCandidate.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(createCandidate.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // updateCandidateStage
      .addCase(updateCandidateStage.fulfilled, (state, action) => {
        const idx = state.items.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateCandidateStage.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // fetchCandidateTimeline
      .addCase(fetchCandidateTimeline.fulfilled, (state, action) => {
        state.timeline[action.meta.arg] = action.payload;
      })
      .addCase(fetchCandidateTimeline.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // addCandidateNote
      .addCase(addCandidateNote.fulfilled, (state, action) => {
        const idx = state.items.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(addCandidateNote.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

// -----------------------------
// Actions
// -----------------------------
export const { clearError } = candidatesSlice.actions;

// -----------------------------
// Selectors
// -----------------------------
export const selectCandidates = (state) => state.candidates.items;
export const selectCandidatesLoading = (state) => state.candidates.loading;
export const selectCandidatesError = (state) => state.candidates.error;
export const selectCandidateTimeline = (state, id) =>
  state.candidates.timeline[id] || [];

// Get candidate by ID
export const selectCandidateById = (state, id) =>
  state.candidates.items.find((c) => c.id === id);

// Group candidates by stage for Kanban board
export const selectCandidatesByStage = (state) => {
  const candidates = state.candidates.items;
  const stages = ["applied", "screen", "tech", "offer", "hired", "rejected"];
  
  return stages.reduce((acc, stage) => {
    acc[stage] = candidates.filter((c) => c.stage === stage);
    return acc;
  }, {});
};

// Filter candidates by search query (name or email)
export const selectFilteredCandidates = (state, searchQuery = "") => {
  const candidates = state.candidates.items;
  if (!searchQuery) return candidates;
  
  const query = searchQuery.toLowerCase();
  return candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query)
  );
};

// Get candidates count by stage
export const selectCandidatesCountByStage = (state) => {
  const candidates = state.candidates.items;
  return candidates.reduce((acc, candidate) => {
    acc[candidate.stage] = (acc[candidate.stage] || 0) + 1;
    return acc;
  }, {});
};

export default candidatesSlice.reducer;