// src/pages/JobDetailsPage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchJobs, updateJob } from "../app/slices/jobsSlice";
import Loader from "../components/common/Loader";
import ErrorBoundary from "../components/common/ErrorBoundary";
import Modal from "../components/common/Modal";
import JobForm from "../components/jobs/JobForm";
import { formatDate } from "../utils/formatters";

export default function JobDetailsPage() {
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: jobs, loading, error } = useSelector((state) => state.jobs);

  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    if (!jobs || jobs.length === 0) {
      dispatch(fetchJobs());
    }
  }, [dispatch, jobs]);

  const job = jobs.find((j) => j.id === jobId);

  const handleStatusToggle = async () => {
    if (!job) return;
    const newStatus = job.status === "active" || job.status === "open" ? "archived" : "active";
    await dispatch(updateJob({ id: job.id, data: { status: newStatus } }));
  };

  if (loading) return <Loader message="Loading job details..." />;

  if (error) {
    return (
      <div className="p-6 bg-red-100 text-red-600 rounded">
        Failed to load job: {error}
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-6 bg-gray-100 text-gray-600 rounded">
        Job not found.
        <button
          onClick={() => navigate("/jobs")}
          className="ml-2 underline text-blue-600"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">{job.title}</h1>
            <p className="text-sm text-gray-500">Slug: {job.slug}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditOpen(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Edit
            </button>
            <button
              onClick={handleStatusToggle}
              className={`px-4 py-2 text-white rounded ${
                job.status === "active" || job.status === "open"
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {job.status === "active" || job.status === "open"
                ? "Archive"
                : "Unarchive"}
            </button>
            <button
              onClick={() => navigate("/jobs")}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Back
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <p className="mb-4">{job.description || "No description available."}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {job.tags?.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-gray-200 px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="text-sm text-gray-500">
            <p>Status: <strong>{job.status}</strong></p>
            <p>Created: {job.createdAt ? formatDate(job.createdAt) : "N/A"}</p>
            <p>Updated: {job.updatedAt ? formatDate(job.updatedAt) : "N/A"}</p>
            <p>Order: {job.order}</p>
          </div>
        </div>

        {/* Edit Modal */}
        <JobForm
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          editingJob={job}
        />
      </div>
    </ErrorBoundary>
  );
}
