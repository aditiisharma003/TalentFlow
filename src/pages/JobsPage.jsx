// src/pages/JobsPage.jsx
import React from "react";
import { useSelector } from "react-redux";
import JobList from "../components/jobs/JobList";
import Loader from "../components/common/Loader";
import ErrorBoundary from "../components/common/ErrorBoundary";

export default function JobsPage() {
  const jobsState = useSelector((state) => state.jobs);

  return (
    <ErrorBoundary>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Job Management</h1>

        {jobsState.loading && <Loader message="Loading jobs..." />}

        {!jobsState.loading && <JobList />}
      </div>
    </ErrorBoundary>
  );
}
