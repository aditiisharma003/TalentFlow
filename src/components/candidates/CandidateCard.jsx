// src/components/candidates/CandidateCard.jsx
import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const CandidateCard = ({ candidate, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Default: navigate to candidate profile
      navigate(`/candidates/${candidate.id}`);
    }
  };

  return (
    <div
      className="p-3 mb-2 bg-white rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 cursor-pointer transition-all"
      onClick={handleClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="font-medium text-gray-900">{candidate.name}</p>
          <p className="text-sm text-gray-500">{candidate.email}</p>
          {candidate.jobId && (
            <p className="text-xs text-gray-400 mt-1">
              Job ID: {candidate.jobId.slice(0, 8)}...
            </p>
          )}
        </div>
        <span
          className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ml-2 ${
            getStageColor(candidate.stage)
          }`}
        >
          {capitalize(candidate.stage)}
        </span>
      </div>
      
      {candidate.timeline && candidate.timeline.length > 0 && (
        <p className="text-xs text-gray-400 mt-2">
          Last updated: {new Date(candidate.timeline[candidate.timeline.length - 1].date).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

// Helper to capitalize stage name
const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Helper to set stage badge color
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

CandidateCard.propTypes = {
  candidate: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    stage: PropTypes.string.isRequired,
    jobId: PropTypes.string,
    timeline: PropTypes.array,
  }).isRequired,
  onClick: PropTypes.func,
};

export default CandidateCard;