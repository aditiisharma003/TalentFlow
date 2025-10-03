// src/persistence/assessmentsRepo.js
import db from "./db";
import { v4 as uuidv4 } from "uuid";

const assessmentsRepo = {
  // --------------------------
  // Builder CRUD
  // --------------------------
  async getAssessment(jobId) {
    let assessment = await db.assessments.get(jobId);
    if (!assessment) {
      // Seed empty builder if not exist
      assessment = { jobId, sections: [] };
      await db.assessments.add(assessment);
    }
    return assessment;
  },

  async saveAssessment(jobId, builder) {
    const existing = await db.assessments.get(jobId);
    if (existing) {
      return db.assessments.put({ ...builder, jobId });
    }
    return db.assessments.add({ ...builder, jobId });
  },

  // --------------------------
  // Candidate Responses
  // --------------------------
  async submitResponse(jobId, candidateId, responses) {
    const id = uuidv4();
    const responseObj = {
      id,
      jobId,
      candidateId,
      responses,
      submittedAt: new Date().toISOString(),
    };
    await db.responses.add(responseObj);
    return responseObj;
  },

  async getResponses(jobId, candidateId) {
    return db.responses
      .where({ jobId, candidateId })
      .toArray();
  },

  async getAllResponses(jobId) {
    return db.responses
      .where("jobId")
      .equals(jobId)
      .toArray();
  },

  // --------------------------
  // Seed sample assessments
  // --------------------------
  async seedAssessments() {
    const count = await db.assessments.count();
    if (count > 0) return;

    const sample = [
      {
        jobId: "job-1",
        sections: [
          {
            title: "JavaScript Basics",
            questions: [
              {
                id: uuidv4(),
                type: "singleChoice",
                question: "What is closure?",
                options: ["Function inside function", "Object prototype"],
                required: true,
              },
              {
                id: uuidv4(),
                type: "multiChoice",
                question: "Select valid JS types",
                options: ["String", "Number", "Boolean"],
                required: true,
              },
            ],
          },
        ],
      },
      {
        jobId: "job-2",
        sections: [
          {
            title: "React Fundamentals",
            questions: [
              {
                id: uuidv4(),
                type: "singleChoice",
                question: "What is JSX?",
                options: ["JS + XML", "JSON"],
                required: true,
              },
            ],
          },
        ],
      },
    ];

    await db.assessments.bulkAdd(sample);
  },
};

export default assessmentsRepo;
