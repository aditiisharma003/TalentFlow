import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/common/Loader";
import { getCandidateTimeline } from "../api/candidatesApi";
import Modal from "../components/common/Modal";

const CandidateProfilePage = () => {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [noteText, setNoteText] = useState("");

  useEffect(() => {
    const fetchCandidate = async () => {
      setLoading(true);
      try {
        const data = await getCandidateTimeline(id);
        setCandidate(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to fetch candidate profile");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id]);

  const handleSaveNote = () => {
    if (!noteText.trim()) return;

    // Update candidate with new note (in a real app, this would call an API)
    const newNote = {
      text: noteText,
      timestamp: new Date().toISOString(),
      author: "Current User" // In a real app, get from auth context
    };

    setCandidate(prev => ({
      ...prev,
      notes: [...(prev.notes || []), newNote]
    }));

    setNoteText("");
    setShowNotesModal(false);
  };

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="p-6 text-red-600 font-semibold">Error: {error}</div>
    );

  if (!candidate) return <p className="p-6">Candidate not found</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Candidate Profile</h1>

      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-xl font-semibold">{candidate.name}</h2>
        <p className="text-gray-600">Email: {candidate.email}</p>
        <p className="text-gray-600">
          Current Stage: <span className="capitalize font-medium">{candidate.stage}</span>
        </p>
        {candidate.jobTitle && (
          <p className="text-gray-600">Applied For: {candidate.jobTitle}</p>
        )}
        <button
          onClick={() => setShowNotesModal(true)}
          className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          View/Add Notes
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Status Timeline</h3>
        {candidate.timeline && candidate.timeline.length > 0 ? (
          <ul className="space-y-2">
            {candidate.timeline.map((t, idx) => (
              <li key={idx} className="p-2 border rounded bg-gray-50">
                <div className="flex justify-between items-center">
                  <strong className="capitalize">{t.stage}</strong>
                  <span className="text-sm text-gray-500">{t.date}</span>
                </div>
                {t.notes && <p className="text-sm text-gray-600 mt-1">{t.notes}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No timeline events yet.</p>
        )}
      </div>

      {/* Notes Modal */}
      <Modal
        show={showNotesModal}
        onClose={() => {
          setShowNotesModal(false);
          setNoteText("");
        }}
        title={`Notes for ${candidate.name}`}
      >
        <div>
          {candidate.notes && candidate.notes.length > 0 ? (
            <ul className="space-y-2 mb-4">
              {candidate.notes.map((n, idx) => (
                <li key={idx} className="p-2 border rounded bg-gray-50">
                  <p>{n.text}</p>
                  {n.timestamp && (
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(n.timestamp).toLocaleString()}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mb-4 text-gray-500">No notes yet.</p>
          )}
          <textarea
            placeholder="Add a note... (use @mentions for team members)"
            className="w-full mt-2 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="4"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          />
          <div className="flex justify-end gap-2 mt-2">
            <button 
              onClick={() => {
                setShowNotesModal(false);
                setNoteText("");
              }}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button 
              onClick={handleSaveNote}
              disabled={!noteText.trim()}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Save Note
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CandidateProfilePage;