import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createCandidate } from "../../app/slices/candidatesSlice";

export default function CandidateForm({ onSubmit }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [stage, setStage] = useState("applied");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const candidate = { name, email, stage };
    await dispatch(createCandidate(candidate));
    if (onSubmit) {
      onSubmit(candidate);
    }
    setName("");
    setEmail("");
    setStage("applied");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md border max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4 text-blue-800">Add Candidate (Dummy)</h2>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Stage</label>
        <select
          value={stage}
          onChange={e => setStage(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="applied">Applied</option>
          <option value="screen">Screen</option>
          <option value="tech">Tech</option>
          <option value="offer">Offer</option>
          <option value="hired">Hired</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Submit</button>
    </form>
  );
}
