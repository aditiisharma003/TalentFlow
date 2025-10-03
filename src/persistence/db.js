import Dexie from "dexie";

// Initialize Dexie database
const db = new Dexie("TalentFlowDB");

// Define database schema
db.version(1).stores({
  jobs: "id, title, slug, status, order, tags",
  candidates: "id, name, email, stage, jobId",
  assessments: "jobId, title, sections", // sections stored as JSON array
  responses: "[jobId+candidateId], jobId, candidateId, responses", // composite key
});

// Optional: open DB immediately and catch errors
db.open().catch((err) => {
  console.error("Failed to open db:", err.stack || err);
});

export default db;
