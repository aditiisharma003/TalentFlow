// src/api/candidatesApi.js
const API_BASE = "/api";

/**
 * Get all candidates (with optional filters & pagination)
 * params: { search, stage, page, pageSize }
 */
export const getCandidates = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${API_BASE}/candidates?${queryString}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch candidates");
  }

  return response.json(); // { results, total, page, pageSize }
};

/**
 * Get single candidate by ID
 */
export const getCandidateById = async (id) => {
  const response = await fetch(`${API_BASE}/candidates/${id}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch candidate");
  }

  return response.json(); // Candidate object
};

/**
 * Get candidate timeline
 */
export const getCandidateTimeline = async (id) => {
  const response = await fetch(`${API_BASE}/candidates/${id}/timeline`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch candidate timeline");
  }

  return response.json(); // timeline array
};

/**
 * Add a new candidate
 */
export const addCandidate = async (candidateData) => {
  const response = await fetch(`${API_BASE}/candidates`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(candidateData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to add candidate");
  }

  return response.json(); // Newly created candidate
};

/**
 * Update candidate by ID
 */
export const updateCandidate = async (id, updates) => {
  const response = await fetch(`${API_BASE}/candidates/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update candidate");
  }

  return response.json(); // Updated candidate
};

/**
 * Move candidate to a new stage (alias for updateCandidate)
 */
export const moveCandidateStage = async (id, newStage) => {
  return updateCandidate(id, { stage: newStage });
};

/**
 * Add note to candidate (alias for updateCandidate)
 */
export const addCandidateNote = async (id, note) => {
  return updateCandidate(id, { note });
};

/**
 * Delete a candidate
 */
export const deleteCandidate = async (id) => {
  const response = await fetch(`${API_BASE}/candidates/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete candidate");
  }

  return response.json(); // { id, deleted: true }
};

// Aliases for compatibility
export const getAllCandidates = getCandidates;
export const createCandidate = addCandidate;
