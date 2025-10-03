// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import jobsReducer from "./slices/jobsSlice";
import candidatesReducer from "./slices/candidatesSlice";
import assessmentsReducer from "./slices/assessmentsSlice";

/**
 * Configure Redux store for TalentFlow
 * - jobs: Jobs board state
 * - candidates: Candidate management state
 * - assessments: Assessment builder & responses
 */
export const store = configureStore({
  reducer: {
    jobs: jobsReducer,
    candidates: candidatesReducer,
    assessments: assessmentsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // IndexedDB or nested objects may not be fully serializable
    }),
});

export default store;
