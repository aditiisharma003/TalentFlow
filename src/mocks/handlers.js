// src/mocks/handlers.js
import { http, HttpResponse } from "msw";
import { initializeSeedData } from "./seedData";

// Initialize seed data once
const seedData = initializeSeedData();
let jobs = [...seedData.jobs];
let candidates = [...seedData.candidates];
let assessments = [...seedData.assessments];

// Helper: simulate network latency + random errors
const simulateNetwork = async (min = 200, max = 1200, failRate = 0.075) => {
  await new Promise((res) =>
    setTimeout(res, Math.random() * (max - min) + min)
  );
  if (Math.random() < failRate) throw new Error("Random simulated server error");
};

export const handlers = [
  /** ---------------- JOBS ---------------- **/
  http.get("/api/jobs", async ({ request }) => {
    try {
      await simulateNetwork();
      const url = new URL(request.url);
      const search = url.searchParams.get("search") || "";
      const status = url.searchParams.get("status") || "";
      const page = parseInt(url.searchParams.get("page") || "1");
      const pageSize = parseInt(url.searchParams.get("pageSize") || "10");
      const sort = url.searchParams.get("sort") || "order";

      let filtered = [...jobs];

      // Filter by search
      if (search) {
        filtered = filtered.filter(job =>
          job.title.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Filter by status
      if (status) {
        filtered = filtered.filter(job => job.status === status);
      }

      // Sort
      if (sort === "order") {
        filtered.sort((a, b) => a.order - b.order);
      } else if (sort === "title") {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
      }

      // Paginate
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const results = filtered.slice(start, end);

      return HttpResponse.json({
        results,
        total: filtered.length,
        page,
        pageSize,
      }, { status: 200 });
    } catch (err) {
      return HttpResponse.json({ message: err.message }, { status: 500 });
    }
  }),

  http.post("/api/jobs", async ({ request }) => {
    try {
      await simulateNetwork();
      const body = await request.json();
      
      // Check for unique slug
      const existingSlug = jobs.find(j => j.slug === body.slug);
      if (existingSlug) {
        return HttpResponse.json(
          { message: "Slug must be unique" },
          { status: 400 }
        );
      }

      const newJob = {
        id: `job-${Date.now()}`,
        order: jobs.length,
        status: "active",
        tags: [],
        createdAt: new Date().toISOString(),
        ...body,
      };
      
      jobs.push(newJob);
      return HttpResponse.json(newJob, { status: 201 });
    } catch (err) {
      return HttpResponse.json({ message: err.message }, { status: 500 });
    }
  }),

  http.patch("/api/jobs/:id", async ({ request, params }) => {
    try {
      await simulateNetwork();
      const { id } = params;
      const body = await request.json();
      
      const jobIndex = jobs.findIndex(j => j.id === id);
      if (jobIndex === -1) {
        return HttpResponse.json({ message: "Job not found" }, { status: 404 });
      }

      // Check slug uniqueness if updating slug
      if (body.slug) {
        const existingSlug = jobs.find(j => j.slug === body.slug && j.id !== id);
        if (existingSlug) {
          return HttpResponse.json(
            { message: "Slug must be unique" },
            { status: 400 }
          );
        }
      }

      jobs[jobIndex] = { ...jobs[jobIndex], ...body };
      return HttpResponse.json(jobs[jobIndex], { status: 200 });
    } catch (err) {
      return HttpResponse.json({ message: err.message }, { status: 500 });
    }
  }),

  http.patch("/api/jobs/:id/reorder", async ({ request, params }) => {
    try {
      await simulateNetwork();
      
      // Simulate occasional failure for rollback testing (10% chance)
      if (Math.random() < 0.1) {
        return HttpResponse.json(
          { message: "Reorder failed - simulated error" },
          { status: 500 }
        );
      }

      const { id } = params;
      const { fromOrder, toOrder } = await request.json();
      
      const jobIndex = jobs.findIndex(j => j.id === id);
      if (jobIndex === -1) {
        return HttpResponse.json({ message: "Job not found" }, { status: 404 });
      }

      // Reorder logic
      jobs = jobs.map(job => {
        if (job.id === id) {
          return { ...job, order: toOrder };
        }
        if (fromOrder < toOrder) {
          if (job.order > fromOrder && job.order <= toOrder) {
            return { ...job, order: job.order - 1 };
          }
        } else {
          if (job.order >= toOrder && job.order < fromOrder) {
            return { ...job, order: job.order + 1 };
          }
        }
        return job;
      });

      const updatedJob = jobs.find(j => j.id === id);
      return HttpResponse.json(updatedJob, { status: 200 });
    } catch (err) {
      return HttpResponse.json({ message: err.message }, { status: 500 });
    }
  }),

  /** ---------------- CANDIDATES ---------------- **/
  http.get("/api/candidates", async ({ request }) => {
    try {
      await simulateNetwork();
      const url = new URL(request.url);
      const search = url.searchParams.get("search") || "";
      const stage = url.searchParams.get("stage") || "";
      const page = parseInt(url.searchParams.get("page") || "1");
      const pageSize = parseInt(url.searchParams.get("pageSize") || "20");

      let filtered = [...candidates];

      // Filter by search (name or email)
      if (search) {
        filtered = filtered.filter(c =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Filter by stage
      if (stage) {
        filtered = filtered.filter(c => c.stage === stage);
      }

      // Paginate
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const results = filtered.slice(start, end);

      return HttpResponse.json({
        results,
        total: filtered.length,
        page,
        pageSize,
      }, { status: 200 });
    } catch (err) {
      return HttpResponse.json({ message: err.message }, { status: 500 });
    }
  }),

  http.post("/api/candidates", async ({ request }) => {
    try {
      await simulateNetwork();
      const body = await request.json();
      
      const newCandidate = {
        id: `candidate-${Date.now()}`,
        stage: "applied",
        appliedAt: new Date().toISOString(),
        notes: [],
        timeline: [{
          stage: "applied",
          date: new Date().toISOString(),
          notes: "Application submitted",
        }],
        ...body,
      };
      
      candidates.push(newCandidate);
      return HttpResponse.json(newCandidate, { status: 201 });
    } catch (err) {
      return HttpResponse.json({ message: err.message }, { status: 500 });
    }
  }),

  http.patch("/api/candidates/:id", async ({ request, params }) => {
    try {
      await simulateNetwork();
      const { id } = params;
      const body = await request.json();
      
      const candidateIndex = candidates.findIndex(c => c.id === id);
      if (candidateIndex === -1) {
        return HttpResponse.json(
          { message: "Candidate not found" },
          { status: 404 }
        );
      }

      // If stage changed, add to timeline
      if (body.stage && body.stage !== candidates[candidateIndex].stage) {
        const timeline = candidates[candidateIndex].timeline || [];
        timeline.push({
          stage: body.stage,
          date: new Date().toISOString(),
          notes: `Moved to ${body.stage} stage`,
        });
        body.timeline = timeline;
      }

      candidates[candidateIndex] = { ...candidates[candidateIndex], ...body };
      return HttpResponse.json(candidates[candidateIndex], { status: 200 });
    } catch (err) {
      return HttpResponse.json({ message: err.message }, { status: 500 });
    }
  }),

  http.get("/api/candidates/:id/timeline", async ({ params }) => {
    try {
      await simulateNetwork();
      const { id } = params;
      
      const candidate = candidates.find(c => c.id === id);
      if (!candidate) {
        return HttpResponse.json(
          { message: "Candidate not found" },
          { status: 404 }
        );
      }

      return HttpResponse.json(candidate, { status: 200 });
    } catch (err) {
      return HttpResponse.json({ message: err.message }, { status: 500 });
    }
  }),

  /** ---------------- ASSESSMENTS ---------------- **/
  http.get("/api/assessments/:jobId", async ({ params }) => {
    try {
      await simulateNetwork();
      const { jobId } = params;
      
      const assessment = assessments.find(a => a.jobId === jobId);
      if (!assessment) {
        return HttpResponse.json(
          { message: "Assessment not found" },
          { status: 404 }
        );
      }

      return HttpResponse.json(assessment, { status: 200 });
    } catch (err) {
      return HttpResponse.json({ message: err.message }, { status: 500 });
    }
  }),

  http.put("/api/assessments/:jobId", async ({ request, params }) => {
    try {
      await simulateNetwork();
      const { jobId } = params;
      const body = await request.json();
      
      const assessmentIndex = assessments.findIndex(a => a.jobId === jobId);
      
      if (assessmentIndex === -1) {
        // Create new assessment
        const newAssessment = {
          id: `assessment-${Date.now()}`,
          jobId,
          createdAt: new Date().toISOString(),
          ...body,
        };
        assessments.push(newAssessment);
        return HttpResponse.json(newAssessment, { status: 201 });
      }

      // Update existing
      assessments[assessmentIndex] = {
        ...assessments[assessmentIndex],
        ...body,
        updatedAt: new Date().toISOString(),
      };
      
      return HttpResponse.json(assessments[assessmentIndex], { status: 200 });
    } catch (err) {
      return HttpResponse.json({ message: err.message }, { status: 500 });
    }
  }),

  http.post("/api/assessments/:jobId/submit", async ({ request, params }) => {
    try {
      await simulateNetwork();
      const { jobId } = params;
      const body = await request.json();
      
      // Store response (would normally save to IndexedDB)
      const submission = {
        id: `submission-${Date.now()}`,
        jobId,
        candidateId: body.candidateId,
        responses: body.responses,
        submittedAt: new Date().toISOString(),
      };

      return HttpResponse.json(submission, { status: 201 });
    } catch (err) {
      return HttpResponse.json({ message: err.message }, { status: 500 });
    }
  }),
];