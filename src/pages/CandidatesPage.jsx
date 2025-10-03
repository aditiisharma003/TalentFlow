import React, { useState, useEffect } from "react";
import CandidateList from "../components/candidates/CandidateList";
import CandidateBoard from "../components/candidates/CandidateBoard";
import Loader from "../components/common/Loader";
import { getCandidates } from "../api/candidatesApi";

const CandidatesPage = () => {
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      try {
        // API returns { results, total, page, pageSize }
        const res = await getCandidates({ pageSize: 1000 });
        setCandidates(res.results || []); // Use res.results instead of res.candidates
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to fetch candidates");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="p-6 text-red-600 font-semibold">
        Error: {error}
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Candidates</h1>

      {/* Candidate search + virtualized list */}
      <div className="mb-6">
        <CandidateList candidates={candidates} />
      </div>

      {/* Kanban board for stage transitions */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Candidate Board</h2>
        <CandidateBoard candidates={candidates} />
      </div>
    </div>
  );
};

export default CandidatesPage;