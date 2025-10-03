// src/api/jobsApi.js
import { v4 as uuidv4 } from "uuid";
import db from "../persistence/db";

/**
 * Simulate network latency (200–1200ms) + 5% random failure
 */
async function simulateNetwork() {
  const delay = 200 + Math.random() * 1000;
  await new Promise((res) => setTimeout(res, delay));
  // Removed random error for stable demo
}

/**
 * Generate slug from title
 */
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Get all jobs with optional filtering, pagination, and sorting
 */
export async function getAllJobs({ search = "", status = "", page = 1, pageSize = 10, sort = "order" } = {}) {
  await simulateNetwork();

  let jobs = await db.jobs.toArray();

  // Filter by search (title)
  if (search) {
    const searchLower = search.toLowerCase();
    jobs = jobs.filter((job) => job.title.toLowerCase().includes(searchLower));
  }

  // Filter by status
  if (status) {
    jobs = jobs.filter((job) => job.status === status);
  }

  // Sort
  if (sort === "order") {
    jobs.sort((a, b) => a.order - b.order);
  } else if (sort === "title") {
    jobs.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === "createdAt") {
    jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // Pagination
  const total = jobs.length;
  const start = (page - 1) * pageSize;
  const results = jobs.slice(start, start + pageSize);

  return {
    results,
    total,
    page,
    pageSize,
  };
}

/**
 * Create a new job
 */
export async function createJob(jobData) {
  await simulateNetwork();

  if (!jobData.title || jobData.title.trim() === "") {
    throw new Error("Job title is required");
  }

  const slug = jobData.slug || generateSlug(jobData.title);

  const existingJobs = await db.jobs.toArray();
  if (existingJobs.some((j) => j.slug === slug)) {
    throw new Error(`Job with slug "${slug}" already exists`);
  }

  const maxOrder = existingJobs.reduce((max, job) => Math.max(max, job.order || 0), 0);

  const newJob = {
    id: uuidv4(),
    title: jobData.title.trim(),
    slug,
    description: jobData.description || "",
    status: jobData.status || "active",
    tags: jobData.tags || [],
    order: maxOrder + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await db.jobs.add(newJob);
  return newJob;
}

/**
 * Update job by ID
 */
export async function updateJob(id, updates) {
  await simulateNetwork();

  const job = await db.jobs.get(id);
  if (!job) throw new Error("Job not found");

  // Check for slug conflicts
  if (updates.slug && updates.slug !== job.slug) {
    const existingJobs = await db.jobs.toArray();
    if (existingJobs.some((j) => j.slug === updates.slug && j.id !== id)) {
      throw new Error(`Job with slug "${updates.slug}" already exists`);
    }
  }

  const updatedJob = {
    ...job,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await db.jobs.put(updatedJob);
  return updatedJob;
}

/**
 * Reorder jobs (drag-and-drop)
 */
export async function reorderJob(id, fromOrder, toOrder) {
  await simulateNetwork();

  if (fromOrder === toOrder) {
    const job = await db.jobs.get(id);
    return job;
  }

  const jobs = await db.jobs.orderBy("order").toArray();
  const jobToMove = jobs.find((j) => j.id === id);

  if (!jobToMove) throw new Error("Job not found for reorder");

  const filtered = jobs.filter((j) => j.id !== id);
  const newIndex = toOrder > fromOrder ? toOrder - 1 : toOrder;

  filtered.splice(newIndex, 0, jobToMove);

  const reordered = filtered.map((job, index) => ({
    ...job,
    order: index + 1,
    updatedAt: new Date().toISOString(),
  }));

  await db.transaction("rw", db.jobs, async () => {
    for (const job of reordered) {
      await db.jobs.put(job);
    }
  });

  return reordered.find((j) => j.id === id);
}

/**
 * Delete job by ID
 */
export async function deleteJob(id) {
  await simulateNetwork();
  await db.jobs.delete(id);
  return { id, deleted: true };
}
