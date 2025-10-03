import React, { useState } from "react";
import { Link } from "react-router-dom";
import JobForm from "../components/jobs/JobForm";
import CandidateForm from "../components/candidates/CandidateForm";
import Modal from "../components/common/Modal";

export default function HomePage() {
  const [showJobModal, setShowJobModal] = useState(false);
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleDummySubmit = (type) => {
    setSuccessMsg(`${type} dummy data submitted!`);
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <img src="/vite.svg" alt="TalentFlow Logo" className="h-20 w-20 mb-6" />
      <h1 className="text-5xl font-extrabold text-blue-900 mb-4 text-center drop-shadow">Welcome to TalentFlow</h1>
      <p className="text-xl text-gray-600 mb-10 text-center max-w-2xl">
        The modern platform for managing your hiring pipeline. Effortlessly organize jobs, candidates, and assessments in one place.
      </p>
      {successMsg && <div className="mb-6 px-6 py-3 bg-green-100 text-green-800 rounded shadow font-semibold">{successMsg}</div>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {/* Jobs Card */}
        <div className="bg-white rounded-2xl shadow-lg border p-8 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-blue-800 mb-2">Jobs</h2>
          <p className="text-gray-500 mb-4 text-center">Manage and add job postings for your company.</p>
          <div className="flex gap-2">
            <Link to="/jobs" className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition">View Jobs</Link>
          </div>
        </div>
        {/* Candidates Card */}
        <div className="bg-white rounded-2xl shadow-lg border p-8 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-green-800 mb-2">Candidates</h2>
          <p className="text-gray-500 mb-4 text-center">Track and add candidates in your pipeline.</p>
          <div className="flex gap-2">
            <Link to="/candidates" className="px-5 py-2 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 transition">View Candidates</Link>
          </div>
        </div>
        {/* Assessments Card */}
        <div className="bg-white rounded-2xl shadow-lg border p-8 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-purple-800 mb-2">Assessments</h2>
          <p className="text-gray-500 mb-4 text-center">Create and preview assessments for jobs.</p>
          <div className="flex gap-2">
            <Link to="/assessments" className="px-5 py-2 bg-purple-600 text-white rounded-lg font-semibold shadow hover:bg-purple-700 transition">View Assessments</Link>
          </div>
        </div>
      </div>

      {/* Modals for dummy data entry */}
      <Modal show={showJobModal} onClose={() => setShowJobModal(false)} title="Add Job (Dummy)">
        <JobForm isOpen={true} onClose={() => { setShowJobModal(false); handleDummySubmit('Job'); }} />
      </Modal>
      <Modal show={showCandidateModal} onClose={() => setShowCandidateModal(false)} title="Add Candidate (Dummy)">
        <CandidateForm onSubmit={() => { setShowCandidateModal(false); handleDummySubmit('Candidate'); }} />
      </Modal>
      <Modal show={showAssessmentModal} onClose={() => setShowAssessmentModal(false)} title="Add Assessment (Dummy)">
        <div className="p-4 text-center text-gray-600">Assessment creation coming soon! (Demo only)</div>
        <button onClick={() => { setShowAssessmentModal(false); handleDummySubmit('Assessment'); }} className="mt-4 px-5 py-2 bg-purple-600 text-white rounded-lg font-semibold shadow hover:bg-purple-700 transition">Submit Dummy</button>
      </Modal>
    </div>
  );
}
