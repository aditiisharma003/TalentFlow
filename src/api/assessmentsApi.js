// src/api/assessmentsApi.js
import assessmentsRepo from "../persistence/assessmentsRepo";

// --------------------------
// Simulate network delay & error
// --------------------------
const simulateNetwork = async (fn, errorRate = 0.05) => {
  const delay = 200 + Math.random() * 1000; // 200–1200ms
  await new Promise((res) => setTimeout(res, delay));
  if (Math.random() < errorRate) throw new Error("Simulated server error");
  return await fn();
};

// ---------------------------
// GET /assessments/:jobId
// ---------------------------
export const getAssessment = async (jobId) => {
  return simulateNetwork(async () => {
    const assessment = await assessmentsRepo.getAssessment(jobId);
    // Return empty assessment if not found instead of throwing
    if (!assessment) {
      return {
        jobId,
        sections: [],
        createdAt: new Date().toISOString(),
      };
    }
    return assessment;
  });
};

// ---------------------------
// PUT /assessments/:jobId
// ---------------------------
export const saveAssessment = async (jobId, builder) => {
  return simulateNetwork(async () => {
    const assessment = {
      jobId,
      ...builder,
      updatedAt: new Date().toISOString(),
    };
    await assessmentsRepo.saveAssessment(jobId, assessment);
    return assessment;
  });
};

// ---------------------------
// POST /assessments/:jobId/submit
// Note: MSW handler expects submitAssessment(jobId, body)
// where body contains the responses
// ---------------------------
export const submitAssessment = async (jobId, body) => {
  return simulateNetwork(async () => {
    const { candidateId, responses } = body;
    if (!candidateId) throw new Error("candidateId is required");
    
    const submission = {
      jobId,
      candidateId,
      responses,
      submittedAt: new Date().toISOString(),
    };
    
    await assessmentsRepo.submitResponse(jobId, candidateId, responses);
    return submission;
  });
};

// ---------------------------
// GET responses (per candidate)
// ---------------------------
export const getCandidateResponses = async (jobId, candidateId) => {
  return simulateNetwork(async () => {
    return await assessmentsRepo.getResponses(jobId, candidateId);
  }, 0.02); // Lower error rate for reads
};

// ---------------------------
// GET all responses for job
// ---------------------------
export const getAllResponses = async (jobId) => {
  return simulateNetwork(async () => {
    return await assessmentsRepo.getAllResponses(jobId);
  }, 0.02); // Lower error rate for reads
};