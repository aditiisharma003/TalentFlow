import React, { useEffect, useState } from "react";
import { getAssessment, saveAssessment } from "../../api/assessmentsApi";
import Modal from "../common/Modal";
import { v4 as uuidv4 } from "uuid";

function AssessmentBuilder({ jobId, assessment, setAssessment }) {
  // Add Section
  const addSection = () => {
    const newSection = { title: "New Section", questions: [], id: uuidv4() };
    setAssessment({ ...assessment, sections: [...assessment.sections, newSection] });
  };

  // Add Question
  const addQuestion = (sectionId, type = "shortText") => {
    const newQuestion = {
      id: uuidv4(),
      type,
      question: "New Question",
      options: [],
      required: false,
    };
    const sections = assessment.sections.map((s) =>
      s.id === sectionId ? { ...s, questions: [...s.questions, newQuestion] } : s
    );
    setAssessment({ ...assessment, sections });
  };

  // Save Assessment
  const save = async () => {
    try {
      await saveAssessment(jobId, assessment);
      alert("Saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save");
    }
  };

  if (!assessment) return <div className="p-8 text-center text-gray-500">No assessment found</div>;

  return (
    <div className="p-4 bg-white rounded-xl shadow-md border border-blue-100">
      <h2 className="text-2xl font-extrabold mb-4 text-blue-900 drop-shadow-sm">Assessment Builder</h2>
      <button onClick={addSection} className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 font-semibold transition mb-6">
        + Add Section
      </button>
      <div className="space-y-6">
        {assessment.sections.map((section, idx) => (
          <div key={section.id} className="mb-2 border-l-4 border-blue-400 bg-blue-50 rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <input
                className="font-bold text-lg text-blue-800 bg-transparent border-b border-blue-200 focus:outline-none focus:border-blue-500 w-2/3"
                value={section.title}
                onChange={e => {
                  const sections = assessment.sections.map(s =>
                    s.id === section.id ? { ...s, title: e.target.value } : s
                  );
                  setAssessment({ ...assessment, sections });
                }}
              />
              <button
                onClick={() => addQuestion(section.id)}
                className="px-3 py-1 bg-blue-600 text-white rounded shadow hover:bg-blue-700 text-sm font-medium"
              >
                + Add Question
              </button>
            </div>
            <ul className="space-y-2">
              {section.questions.map((q, qidx) => (
                <li key={q.id} className="p-2 bg-white rounded flex items-center gap-2 border border-blue-100">
                  <span className="font-semibold text-blue-700">Q{qidx + 1}:</span>
                  <input
                    className="flex-1 bg-transparent border-b border-blue-200 focus:outline-none focus:border-blue-500"
                    value={q.question}
                    onChange={e => {
                      const sections = assessment.sections.map(s =>
                        s.id === section.id ? {
                          ...s,
                          questions: s.questions.map(qq =>
                            qq.id === q.id ? { ...qq, question: e.target.value } : qq
                          )
                        } : s
                      );
                      setAssessment({ ...assessment, sections });
                    }}
                  />
                  <span className="text-xs text-blue-400">({q.type})</span>
                  <input
                    type="checkbox"
                    checked={q.required}
                    onChange={e => {
                      const sections = assessment.sections.map(s =>
                        s.id === section.id ? {
                          ...s,
                          questions: s.questions.map(qq =>
                            qq.id === q.id ? { ...qq, required: e.target.checked } : qq
                          )
                        } : s
                      );
                      setAssessment({ ...assessment, sections });
                    }}
                    className="ml-2"
                  />
                  <span className="text-xs text-blue-500 ml-1">Required</span>
                  <button
                    className="ml-4 px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 text-xs font-semibold"
                    title="Delete question"
                    onClick={() => {
                      const sections = assessment.sections.map(s =>
                        s.id === section.id ? {
                          ...s,
                          questions: s.questions.filter(qq => qq.id !== q.id)
                        } : s
                      );
                      setAssessment({ ...assessment, sections });
                    }}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <button
        onClick={save}
        className="mt-8 px-6 py-2 bg-blue-700 text-white rounded-lg shadow hover:bg-blue-800 font-bold text-lg"
      >
        Save Assessment
      </button>
    </div>
  );
}

export default AssessmentBuilder;
