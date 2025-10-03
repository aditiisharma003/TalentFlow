import React, { useEffect, useState } from "react";
import { seedAllIfEmpty } from "./persistence/seedDB";
import { Routes, Route, Link, useLocation } from "react-router-dom";

// Pages
import JobsPage from "./pages/JobsPage";
import JobDetailsPage from "./pages/JobDetailsPage";
import CandidatesPage from "./pages/CandidatesPage";
import CandidateProfilePage from "./pages/CandidateProfilePage";
import AssessmentsPage from "./pages/AssessmentsPage";
import NotFound from "./pages/NotFound";
import HomePage from "./pages/HomePage";

// Common components
import ErrorBoundary from "./components/common/ErrorBoundary";

function App() {
  const [seeding, setSeeding] = useState(true);
  const location = useLocation();
  useEffect(() => {
    seedAllIfEmpty().finally(() => setSeeding(false));
  }, []);

  if (seeding) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200">
        <div className="text-xl text-blue-700 font-bold animate-pulse">Seeding initial data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-white to-blue-200 animate-fadein font-sans">
      {/* Navbar */}
      <nav className="bg-white/90 backdrop-blur shadow-md px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <img src="/vite.svg" alt="TalentFlow Logo" className="h-8 w-8" />
          <span className="font-extrabold text-2xl text-blue-700 tracking-tight drop-shadow-sm">TalentFlow</span>
        </div>
        <div className="space-x-2 md:space-x-4 flex items-center">
          <Link
            to="/jobs"
            className="hover:bg-blue-100 hover:text-blue-700 px-4 py-2 rounded-lg font-medium transition shadow-sm"
          >
            Jobs
          </Link>
          <Link
            to="/candidates"
            className="hover:bg-blue-100 hover:text-blue-700 px-4 py-2 rounded-lg font-medium transition shadow-sm"
          >
            Candidates
          </Link>
          <Link
            to="/assessments"
            className="hover:bg-blue-100 hover:text-blue-700 px-4 py-2 rounded-lg font-medium transition shadow-sm"
          >
            Assessments
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-0 md:p-6">
        <div className="max-w-6xl mx-auto w-full">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/jobs/:id" element={<JobDetailsPage />} />
              <Route path="/candidates" element={<CandidatesPage />} />
              <Route path="/candidates/:id" element={<CandidateProfilePage />} />
              <Route path="/assessments" element={<AssessmentsPage />} />
              <Route path="/assessments/:jobId" element={<AssessmentsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 text-blue-900 text-center p-4 shadow-inner border-t border-blue-100 mt-8">
        <span className="font-semibold">&copy; {new Date().getFullYear()} TalentFlow</span> &mdash; Mini Hiring Platform
      </footer>
    </div>
  );
}

export default App;
