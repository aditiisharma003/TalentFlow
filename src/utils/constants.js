// src/utils/constants.js

// Candidate stages
export const CANDIDATE_STAGES = [
  "applied",
  "screen",
  "tech",
  "offer",
  "hired",
  "rejected",
];

// Job statuses
export const JOB_STATUSES = ["active", "archived"];

// Default error messages
export const ERROR_MESSAGES = {
  required: "This field is required.",
  invalidNumber: "Invalid number.",
  slugNotUnique: "Slug must be unique.",
};

// Question types for assessments
export const QUESTION_TYPES = [
  "single-choice",
  "multi-choice",
  "short-text",
  "long-text",
  "numeric",
  "file-upload",
];

// Max limits (can be used in validations)
export const MAX_LENGTHS = {
  shortText: 100,
  longText: 500,
};
