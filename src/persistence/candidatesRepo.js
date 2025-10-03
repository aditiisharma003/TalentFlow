// src/persistence/candidatesRepo.js
import db from "./db";
import { v4 as uuidv4 } from "uuid";
import { CANDIDATE_STAGES } from "../utils/constants";

// Random data generators for seeding
const firstNames = [
  "Alice", "Bob", "Charlie", "Diana", "Ethan", "Fiona", "George", "Hannah", 
  "Ian", "Julia", "Kevin", "Laura", "Michael", "Nina", "Oliver", "Patricia",
  "Quinn", "Rachel", "Samuel", "Tina", "Uma", "Victor", "Wendy", "Xavier",
  "Yara", "Zachary", "Amelia", "Benjamin", "Chloe", "Daniel", "Emma", "Felix",
  "Grace", "Henry", "Isabella", "Jack", "Katherine", "Liam", "Mia", "Noah",
  "Olivia", "Peter", "Quinn", "Ryan", "Sophia", "Thomas", "Victoria", "William"
];

const lastNames = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
  "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
  "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
  "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker",
  "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores"
];

/**
 * Generate random name
 */
const randomName = () => {
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${first} ${last}`;
};

/**
 * Generate email from name
 */
const randomEmail = (name) => {
  const normalized = name.toLowerCase().replace(/\s+/g, ".");
  const domain = ["example.com", "test.com", "demo.com"][Math.floor(Math.random() * 3)];
  return `${normalized}@${domain}`;
};

/**
 * Generate random date within last 90 days
 */
const randomRecentDate = () => {
  const now = Date.now();
  const ninetyDaysAgo = now - 90 * 24 * 60 * 60 * 1000;
  const randomTime = ninetyDaysAgo + Math.random() * (now - ninetyDaysAgo);
  return new Date(randomTime).toISOString();
};

/**
 * Seed 1000 candidates with random data
 */
export const seedCandidates = async (jobIds) => {
  const count = await db.candidates.count();
  if (count > 0) {
    console.log("Candidates already seeded, skipping...");
    return;
  }

  console.log("Seeding 1000 candidates...");
  const candidates = [];

  for (let i = 0; i < 1000; i++) {
    const name = randomName();
    const email = randomEmail(name);
    const stage = CANDIDATE_STAGES[Math.floor(Math.random() * CANDIDATE_STAGES.length)];
    const jobId = jobIds[Math.floor(Math.random() * jobIds.length)];
    const createdAt = randomRecentDate();

    // Build timeline based on current stage
    const timeline = [];
    const stageIndex = CANDIDATE_STAGES.indexOf(stage);
    
    // Add timeline entries for each stage up to current
    for (let j = 0; j <= stageIndex; j++) {
      timeline.push({
        stage: CANDIDATE_STAGES[j],
        date: new Date(Date.parse(createdAt) + j * 24 * 60 * 60 * 1000).toISOString(),
        note: `Moved to ${CANDIDATE_STAGES[j]}`,
      });
    }

    candidates.push({
      id: uuidv4(),
      name,
      email,
      jobId,
      stage,
      timeline,
      notes: [],
      createdAt,
      updatedAt: createdAt,
    });
  }

  await db.candidates.bulkAdd(candidates);
  console.log(`✅ Seeded ${candidates.length} candidates`);
};

// ---------------------------
// CRUD Operations
// ---------------------------
const candidatesRepo = {
  /**
   * Seed initial data
   */
  seedCandidates,

  /**
   * Get all candidates
   */
  async getAll() {
    return await db.candidates.toArray();
  },

  /**
   * Get candidate by ID
   */
  async getById(id) {
    return await db.candidates.get(id);
  },

  /**
   * Get candidates by job ID
   */
  async getByJobId(jobId) {
    return await db.candidates.where("jobId").equals(jobId).toArray();
  },

  /**
   * Get candidates by stage
   */
  async getByStage(stage) {
    return await db.candidates.where("stage").equals(stage).toArray();
  },

  /**
   * Add new candidate
   */
  async add(candidate) {
    return await db.candidates.add(candidate);
  },

  /**
   * Update candidate
   */
  async update(candidate) {
    return await db.candidates.put(candidate);
  },

  /**
   * Delete candidate
   */
  async delete(id) {
    return await db.candidates.delete(id);
  },

  /**
   * Bulk update candidates
   */
  async bulkUpdate(candidates) {
    return await db.candidates.bulkPut(candidates);
  },

  /**
   * Clear all candidates (for testing)
   */
  async clear() {
    return await db.candidates.clear();
  },
};

export default candidatesRepo;