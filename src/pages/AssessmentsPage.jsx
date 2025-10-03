import React, { useState, useEffect } from "react";
import AssessmentBuilder from "../components/assessments/AssessmentBuilder";
import AssessmentPreview from "../components/assessments/AssessmentPreview";
import AssessmentForm from "../components/assessments/AssessmentForm";
import Modal from "../components/common/Modal";
import Loader from "../components/common/Loader";
import { getAssessment } from "../api/assessmentsApi";

const JOB_ID = "job-123";
const CANDIDATE_ID = "candidate-456";

export default function AssessmentsPage() {
  const [activeTab, setActiveTab] = useState("builder");
  const [showFormModal, setShowFormModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [assessment, setAssessment] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssessment = async () => {
      setLoading(true);
      try {
        const data = await getAssessment(JOB_ID);
        setAssessment(data);
      } catch (err) {
        setError(err.message || "Failed to load assessment");
      } finally {
        setLoading(false);
      }
    };
    fetchAssessment();
  }, []);

  if (loading) return <Loader />;
  if (error) return <div className="p-6 text-red-600 font-semibold">Error: {error}</div>;

  // Calculate summary stats
  const numSections = assessment?.sections?.length || 0;
  const numQuestions = assessment?.sections?.reduce((sum, s) => sum + (s.questions?.length || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 py-10 px-2 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-6 bg-white rounded-2xl shadow-lg p-8 overflow-hidden border border-blue-100">
          <div>
            <h1 className="text-4xl font-extrabold text-blue-800 mb-2 drop-shadow animate-fadein">Assessments</h1>
            <p className="text-lg text-blue-700 max-w-xl animate-fadein-slow">Create, preview, and test candidate assessments for your jobs. Use the builder to design, preview to see the candidate view, or try the form as a candidate.</p>
            <div className="flex gap-6 mt-6">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-blue-700">{numSections}</span>
                <span className="text-xs text-blue-400">Sections</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-blue-700">{numQuestions}</span>
                <span className="text-xs text-blue-400">Questions</span>
              </div>
            </div>
          </div>
          <img src="/vite.svg" alt="Assessment" className="h-24 w-24 md:h-32 md:w-32 drop-shadow-lg animate-float" />
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 justify-center">
          <button
            className={`px-7 py-3 rounded-full font-semibold text-lg transition shadow-sm border-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${activeTab === "builder" ? "bg-blue-700 text-white border-blue-700 scale-105" : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50"}`}
            onClick={() => setActiveTab("builder")}
          >
            Assessment Builder
          </button>
          <button
            className={`px-7 py-3 rounded-full font-semibold text-lg transition shadow-sm border-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${activeTab === "preview" ? "bg-blue-700 text-white border-blue-700 scale-105" : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50"}`}
            onClick={() => setActiveTab("preview")}
          >
            Preview
          </button>
        </div>

        {/* Tab content */}
        <div className="bg-white p-8 rounded-2xl shadow-xl min-h-[400px] animate-fadein">
          {activeTab === "builder" && <AssessmentBuilder jobId={JOB_ID} assessment={assessment} setAssessment={setAssessment} />}
          {activeTab === "preview" && <AssessmentPreview assessment={assessment} />}
        </div>

        {/* Modal for candidate form */}
        <Modal
          show={showFormModal}
          onClose={() => setShowFormModal(false)}
          title="Candidate Assessment"
        >
          <AssessmentForm jobId={JOB_ID} candidateId={CANDIDATE_ID} assessment={assessment} />
        </Modal>
      </div>
    </div>
  );
}
