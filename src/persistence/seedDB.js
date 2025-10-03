// src/persistence/seedDB.js
import db from "./db";
import { generateJobs, generateCandidates } from "../mocks/seedData";

export async function seedAllIfEmpty() {
  try {
    // ---------------- Jobs ----------------
    const jobCount = await db.jobs.count();
    let jobs = [];

    if (jobCount === 0) {
      jobs = generateJobs(); // Use string IDs as generated
      await db.jobs.bulkAdd(jobs);
      console.log(`[SeedDB] Inserted ${jobs.length} jobs`);
    } else {
      jobs = await db.jobs.toArray();
      console.log(`[SeedDB] Found ${jobs.length} jobs`);
    }

    // ---------------- Candidates ----------------
    const candidateCount = await db.candidates.count();

    if (candidateCount === 0 && jobs.length > 0) {
      const candidates = generateCandidates(jobs).map((c, i) => ({
        id: i + 1, // ✅ assign id manually
        ...c,
        name: `${c.name.split(" ")[0]} ${String.fromCharCode(65 + (i % 26))}${i}`,
        email: `candidate${i}@example.com`,
        phone: `+91-9${String(i).padStart(9, "0")}`,
      }));

      await db.candidates.bulkAdd(candidates);
      console.log(`[SeedDB] Inserted ${candidates.length} candidates`);
    } else {
      console.log(`[SeedDB] Found ${candidateCount} candidates`);
    }
  } catch (error) {
    console.error("[SeedDB] Seeding error:", error);
    if (error.failures) {
      console.error("Failures:", error.failures);
    }
  }
}
