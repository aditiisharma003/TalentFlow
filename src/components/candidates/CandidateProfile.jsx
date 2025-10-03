// src/components/candidates/CandidateProfile.jsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  selectCandidateById,
  selectCandidatesLoading,
  selectCandidatesError,
  fetchCandidates,
  addCandidateNote,
  updateCandidateStage,
} from "../../app/slices/candidatesSlice";
import Loader from "../common/Loader";
import { CANDIDATE_STAGES } from "../../utils/constants";

const CandidateProfile = () => {
  const { id: candidateId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const candidate = useSelector((state) =>
    selectCandidateById(state, candidateId)
  );
  const loading = useSelector(selectCandidatesLoading);
  const error = useSelector(selectCandidatesError);
  
  const [note, setNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);

  // Fetch candidates if not loaded
  useEffect(() => {
    if (!candidate && !loading) {
      dispatch(fetchCandidates());
    }
  }, [candidate, loading, dispatch]);

  const handleAddNote = async () => {
    if (!note.trim()) return;
    
    setIsAddingNote(true);
    try {
      await dispatch(addCandidateNote({ id: candidateId, note: note.trim() })).unwrap();
      setNote("");
    } catch (err) {
      console.error("Failed to add note:", err);
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleStageChange = (newStage) => {
    if (window.confirm(`Move candidate to ${newStage}?`)) {
      dispatch(updateCandidateStage({ id: candidateId, stage: newStage }));
    }
  };

  if (loading && !candidate) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 mb-4">Error: {error}</p>
        <button
          onClick={() => dispatch(fetchCandidates())}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600 mb-4">Candidate not found</p>
        <button
          onClick={() => navigate("/candidates")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Candidates
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <button
          onClick={() => navigate("/candidates")}
          className="text-blue-600 hover:text-blue-800 mb-4 text-sm"
        >
          ← Back to Candidates
        </button>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{candidate.name}</h1>
            <p className="text-gray-600 mt-1">{candidate.email}</p>
            {candidate.jobId && (
              <p className="text-sm text-gray-500 mt-1">
                Job ID: {candidate.jobId}
              </p>
            )}
          </div>
          
          <span
            className={`px-3 py-1 rounded-lg text-sm font-semibold ${
              getStageColor(candidate.stage)
            }`}
          >
            {candidate.stage.charAt(0).toUpperCase() + candidate.stage.slice(1)}
          </span>
        </div>

        {/* Stage Actions */}
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-gray-600 mb-2">Move to stage:</p>
          <div className="flex flex-wrap gap-2">
            {CANDIDATE_STAGES.filter((s) => s !== candidate.stage).map((stage) => (
              <button
                key={stage}
                onClick={() => handleStageChange(stage)}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              >
                {stage.charAt(0).toUpperCase() + stage.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Timeline</h2>
        {candidate.timeline && candidate.timeline.length > 0 ? (
          <div className="space-y-3">
            {candidate.timeline.map((entry, idx) => (
              <div key={idx} className="flex items-start gap-3 pb-3 border-b last:border-b-0">
                <div className={`w-2 h-2 rounded-full mt-2 ${getStageColorDot(entry.stage)}`} />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">
                        {entry.stage.charAt(0).toUpperCase() + entry.stage.slice(1)}
                      </p>
                      {entry.note && (
                        <p className="text-sm text-gray-600 mt-1">{entry.note}</p>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(entry.date).toLocaleDateString()} {new Date(entry.date).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No timeline entries</p>
        )}
      </div>

      {/* Notes */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Notes</h2>
        
        {/* Existing Notes */}
        {candidate.notes && candidate.notes.length > 0 ? (
          <div className="space-y-3 mb-4">
            {candidate.notes.map((n) => (
              <div key={n.id} className="bg-gray-50 p-3 rounded">
                <p className="text-gray-800">{n.text}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(n.date).toLocaleDateString()} at {new Date(n.date).toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mb-4">No notes yet</p>
        )}

        {/* Add Note */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add a note (supports @mentions)..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddNote()}
            className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isAddingNote}
          />
          <button
            onClick={handleAddNote}
            disabled={!note.trim() || isAddingNote}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isAddingNote ? "Adding..." : "Add Note"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const getStageColor = (stage) => {
  switch (stage) {
    case "applied":
      return "bg-blue-100 text-blue-800";
    case "screen":
      return "bg-yellow-100 text-yellow-800";
    case "tech":
      return "bg-purple-100 text-purple-800";
    case "offer":
      return "bg-green-100 text-green-800";
    case "hired":
      return "bg-green-200 text-green-900";
    case "rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStageColorDot = (stage) => {
  switch (stage) {
    case "applied":
      return "bg-blue-500";
    case "screen":
      return "bg-yellow-500";
    case "tech":
      return "bg-purple-500";
    case "offer":
      return "bg-green-500";
    case "hired":
      return "bg-green-700";
    case "rejected":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

export default CandidateProfile;