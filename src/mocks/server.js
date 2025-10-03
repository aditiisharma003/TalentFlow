// src/mocks/server.js
import { createServer, Response } from "miragejs";
import { getAllJobs, createJob, updateJob, reorderJob } from "../api/jobsApi";
import { getAllCandidates, createCandidate, updateCandidate } from "../api/candidatesApi";
import { getAssessment, saveAssessment, submitAssessment } from "../api/assessmentsApi";

// Simulate latency + random errors
const simulateNetwork = async (failRate = 0.05, min = 200, max = 1200) => {
  await new Promise((res) =>
    setTimeout(res, Math.random() * (max - min) + min)
  );
  if (Math.random() < failRate) throw new Error("Random server error");
};

// Start MirageJS server
export function makeServer({ environment = "development" } = {}) {
  return createServer({
    environment,
    routes() {
      this.namespace = "api";

      /** ---------------- JOBS ---------------- **/
      this.get("/jobs", async (schema, request) => {
        try {
          await simulateNetwork();
          const search = request.queryParams.search || "";
          const status = request.queryParams.status || "";
          const page = parseInt(request.queryParams.page || "1");
          const pageSize = parseInt(request.queryParams.pageSize || "10");
          const sort = request.queryParams.sort || "order";

          const jobs = await getAllJobs({ search, status, page, pageSize, sort });
          return jobs;
        } catch (err) {
          return new Response(500, {}, { message: err.message });
        }
      });

      this.post("/jobs", async (schema, request) => {
        try {
          await simulateNetwork();
          const job = await createJob(JSON.parse(request.requestBody));
          return new Response(201, {}, job);
        } catch (err) {
          return new Response(500, {}, { message: err.message });
        }
      });

      this.patch("/jobs/:id", async (schema, request) => {
        try {
          await simulateNetwork();
          const { id } = request.params;
          const job = await updateJob(id, JSON.parse(request.requestBody));
          return job;
        } catch (err) {
          return new Response(500, {}, { message: err.message });
        }
      });

      this.patch("/jobs/:id/reorder", async (schema, request) => {
        try {
          await simulateNetwork();
          const { id } = request.params;
          const { fromOrder, toOrder } = JSON.parse(request.requestBody);
          const job = await reorderJob(id, fromOrder, toOrder);
          return job;
        } catch (err) {
          return new Response(500, {}, { message: err.message });
        }
      });

      /** ---------------- CANDIDATES ---------------- **/
      this.get("/candidates", async (schema, request) => {
        await simulateNetwork();
        const search = request.queryParams.search || "";
        const stage = request.queryParams.stage || "";
        const page = parseInt(request.queryParams.page || "1");

        const candidates = await getAllCandidates({ search, stage, page });
        return candidates;
      });

      this.post("/candidates", async (schema, request) => {
        try {
          await simulateNetwork();
          const candidate = await createCandidate(JSON.parse(request.requestBody));
          return new Response(201, {}, candidate);
        } catch (err) {
          return new Response(500, {}, { message: err.message });
        }
      });

      this.patch("/candidates/:id", async (schema, request) => {
        try {
          await simulateNetwork();
          const { id } = request.params;
          const candidate = await updateCandidate(id, JSON.parse(request.requestBody));
          return candidate;
        } catch (err) {
          return new Response(500, {}, { message: err.message });
        }
      });

      /** ---------------- ASSESSMENTS ---------------- **/
      this.get("/assessments/:jobId", async (schema, request) => {
        await simulateNetwork();
        const { jobId } = request.params;
        const assessment = await getAssessment(jobId);
        return assessment;
      });

      this.put("/assessments/:jobId", async (schema, request) => {
        try {
          await simulateNetwork();
          const { jobId } = request.params;
          const assessment = await saveAssessment(jobId, JSON.parse(request.requestBody));
          return assessment;
        } catch (err) {
          return new Response(500, {}, { message: err.message });
        }
      });

      this.post("/assessments/:jobId/submit", async (schema, request) => {
        try {
          await simulateNetwork();
          const { jobId } = request.params;
          const result = await submitAssessment(jobId, JSON.parse(request.requestBody));
          return result;
        } catch (err) {
          return new Response(500, {}, { message: err.message });
        }
      });
    },
  });
}
