// src/components/CandidateList.jsx
import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectCandidates } from "../../app/slices/candidatesSlice";
import CandidateCard from "./CandidateCard.jsx";
import CandidateForm from "./CandidateForm.jsx";

const CandidateList = () => {
  const candidates = useSelector(selectCandidates);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return candidates;
    const s = search.toLowerCase();
    return candidates.filter(
      (c) => c.name.toLowerCase().includes(s) || c.email.toLowerCase().includes(s)
    );
  }, [search, candidates]);

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg border border-blue-100 max-w-5xl mx-auto mt-8">
      <CandidateForm onSubmit={() => alert('This is a dummy form. Submission does nothing.')} />
      <div className="flex flex-col items-center mb-6 mt-8">
        <img src="/vite.svg" alt="TalentFlow Logo" className="h-14 w-14 mb-2" />
        <h2 className="text-2xl font-bold text-blue-800 mb-2 tracking-tight">Candidates</h2>
        <p className="text-gray-500 mb-2">Browse and search all candidates in your pipeline.</p>
      </div>
      <input
        type="text"
        placeholder="Search candidates by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 border border-blue-200 rounded-lg mb-8 focus:ring-2 focus:ring-blue-200 focus:outline-none text-lg shadow-sm"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[600px] overflow-y-auto">
        {filtered.length > 0 ? (
          filtered.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">No candidates found.</p>
        )}
      </div>
    </div>
  );
};

export default CandidateList;
