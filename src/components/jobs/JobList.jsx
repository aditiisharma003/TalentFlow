// src/components/jobs/JobList.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchJobs,
  updateJob as updateJobThunk,
  deleteJob as deleteJobThunk,
} from "../../app/slices/jobsSlice";

import JobCard from "./JobCard";
import JobForm from "./JobForm";
import JobReorder from "./JobReorder";
import Loader from "../common/Loader";
import Pagination from "../common/Pagination";

const PAGE_SIZE = 8;

export default function JobList() {
  const dispatch = useDispatch();
  const jobsState = useSelector((state) => state.jobs || {});
  console.log("[JobList] jobsState:", jobsState);

  // Normalize jobs
  const jobsRaw = jobsState.items;
  const jobs = Array.isArray(jobsRaw)
    ? jobsRaw
    : Array.isArray(jobsRaw?.results)
    ? jobsRaw.results
    : [];

  const loading = !!jobsState.loading;

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  // ✅ Only fetch once (unless user retries)
  useEffect(() => {
    if (!jobsState.loaded) {
      console.log("[JobList] Dispatching fetchJobs");
      dispatch(fetchJobs());
    }
  }, [dispatch, jobsState.loaded]);

  // derived filtered jobs
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (jobs || [])
      .filter((j) => {
        const searchable = [
          j.title,
          j.slug,
          j.description,
          j.company,
          ...(j.tags || []),
        ]
          .join(" ")
          .toLowerCase();
        const matchesQuery = !q || searchable.includes(q);
        const matchesStatus =
          !statusFilter ||
          (j.status || "").toLowerCase() === statusFilter.toLowerCase();
        return matchesQuery && matchesStatus;
      })
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [jobs, query, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openCreate = () => {
    setEditingJob(null);
    setIsFormOpen(true);
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setIsFormOpen(true);
  };

  const handleArchive = async (job) => {
    try {
      const newStatus =
        job.status === "active" || job.status === "open"
          ? "archived"
          : "active";
      await dispatch(
        updateJobThunk({ id: job.id, data: { status: newStatus } })
      ).unwrap();
      dispatch(fetchJobs());
    } catch (err) {
      alert("Failed to update status: " + (err?.message || ""));
    }
  };

  const handleDelete = async (job) => {
    if (!window.confirm(`Delete job "${job.title}"? This cannot be undone.`))
      return;
    try {
      await dispatch(deleteJobThunk(job.id)).unwrap();
      dispatch(fetchJobs());
    } catch (err) {
      alert("Failed to delete job: " + (err?.message || ""));
    }
  };

  const handleView = (job) => {
    handleEdit(job);
  };

  const handleReorderLocal = (updatedJobs) => {
    // optional local UI update hook
  };

  return (
    <section className="relative min-h-screen py-10 px-2 md:px-8 bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-extrabold text-blue-900 drop-shadow-sm">
              Jobs
            </h2>
            <p className="text-base text-gray-500 mt-1">
              Create, edit, archive and reorder job postings.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={openCreate}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 font-semibold transition duration-150"
            >
              + Create Job
            </button>
          </div>
        </div>

        <div className="mb-6 flex flex-col md:flex-row gap-3 md:gap-2">
          <input
            className="border p-3 rounded-lg flex-1 shadow-sm focus:ring-2 focus:ring-blue-200"
            placeholder="Search by title, slug, company, or tags..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
          <select
            className="border p-3 rounded-lg shadow-sm min-w-[140px]"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
            <option value="open">Open</option>
          </select>
        </div>

        {loading ? (
          <Loader message="Loading jobs..." />
        ) : jobsState.error ? (
          <div className="p-6 bg-red-100 text-red-800 rounded-lg shadow-md">
            <p>⚠️ Failed to load jobs: {jobsState.error}</p>
            <button
              onClick={() => dispatch(fetchJobs())}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {filtered.length === 0 ? (
              <div className="p-8 bg-white/80 rounded-xl text-center text-gray-600 shadow-md">
                No jobs found
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h3 className="text-sm text-gray-600 mb-2">
                    Drag & drop to reorder
                  </h3>
                  <JobReorder jobs={filtered} onLocalReorder={handleReorderLocal} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {paginated.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onEdit={handleEdit}
                      onArchive={handleArchive}
                      onView={handleView}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>

                <div className="mt-8">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                </div>
              </>
            )}
          </>
        )}

        <JobForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          editingJob={editingJob}
        />
      </div>
    </section>
  );
}
