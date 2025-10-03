// src/persistence/jobsRepository.js
import { db } from "./db";
import { v4 as uuidv4 } from "uuid";

// ---------------------------
// Seed 25 jobs initially
// ---------------------------
export const seedJobs = async () => {
  const count = await db.jobs.count();
  if (count > 0) return; // already seeded

  const sampleTitles = [
    "Frontend Developer",
    "Backend Engineer",
    "Fullstack Developer",
    "UI/UX Designer",
    "DevOps Engineer",
    "QA Engineer",
    "Product Manager",
    "Data Scientist",
    "Mobile App Developer",
    "Technical Writer",
    "Cloud Engineer",
    "AI/ML Engineer",
    "Salesforce Developer",
    "Business Analyst",
    "Scrum Master",
    "Support Engineer",
    "Cybersecurity Analyst",
    "Database Administrator",
    "Network Engineer",
    "Game Developer",
    "Embedded Systems Engineer",
    "Systems Architect",
    "Site Reliability Engineer",
    "Blockchain Developer",
    "SEO Specialist",
  ];

  const jobs = sampleTitles.map((title, index) => ({
    id: uuidv4(),
    title,
    slug: title.toLowerCase().replace(/\s+/g, "-"),
    status: Math.random() > 0.3 ? "active" : "archived",
    tags: ["tag1", "tag2"],
    order: index + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  await db.jobs.bulkAdd(jobs);
};

// ---------------------------
// CRUD + Reorder
// ---------------------------
const jobsRepository = {
  seedJobs,

  async getAll() {
    return await db.jobs.orderBy("order").toArray();
  },

  async getById(id) {
    return await db.jobs.get(id);
  },

  async add(job) {
    const maxOrder = await this.getMaxOrder();
    const newJob = {
      id: uuidv4(),
      ...job,
      order: maxOrder + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await db.jobs.add(newJob);
    return newJob;
  },

  async update(id, data) {
    const existing = await db.jobs.get(id);
    if (!existing) throw new Error("Job not found");

    const updated = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    await db.jobs.put(updated);
    return updated;
  },

  async delete(id) {
    await db.jobs.delete(id);
    return id;
  },

  async getMaxOrder() {
    const lastJob = await db.jobs.orderBy("order").last();
    return lastJob ? lastJob.order : 0;
  },

  async reorder(fromOrder, toOrder) {
    const jobs = await db.jobs.orderBy("order").toArray();
    const jobToMove = jobs.find((j) => j.order === fromOrder);
    if (!jobToMove) throw new Error("Job not found");

    // Remove job from array
    const filtered = jobs.filter((j) => j.id !== jobToMove.id);
    const targetIndex = filtered.findIndex((j) => j.order === toOrder);
    if (targetIndex === -1) throw new Error("Target order not found");

    // Insert at new index
    filtered.splice(targetIndex, 0, jobToMove);

    // Reassign sequential order
    const reordered = filtered.map((job, index) => ({
      ...job,
      order: index + 1,
      updatedAt: new Date().toISOString(),
    }));

    await db.jobs.clear();
    await db.jobs.bulkAdd(reordered);

    return reordered;
  },
};

export default jobsRepository;
