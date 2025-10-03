import React, { useEffect, useState } from "react";
import { getAssessment, submitAssessment } from "../../api/assessmentsApi";
import SingleChoice from "./QuestionTypes/SingleChoice";
import MultiChoice from "./QuestionTypes/MultiChoice";
import ShortText from "./QuestionTypes/ShortText";
import LongText from "./QuestionTypes/LongText";
import NumericInput from "./QuestionTypes/NumericInput";
import FileUploadStub from "./QuestionTypes/FileUploadStub";

const COMPONENT_MAP = {
  singleChoice: SingleChoice,
  multiChoice: MultiChoice,
  shortText: ShortText,
  longText: LongText,
  numeric: NumericInput,
  file: FileUploadStub,
};


function AssessmentForm({ jobId, candidateId, assessment: propAssessment }) {
  const [assessment, setAssessment] = useState(propAssessment || null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(!propAssessment);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (propAssessment) {
      setAssessment(propAssessment);
      setLoading(false);
      return;
    }
    const fetch = async () => {
      try {
        const res = await getAssessment(jobId);
        setAssessment(res);
      } catch (err) {
        console.error(err);
        alert("Failed to load assessment");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [jobId, propAssessment]);

  const handleChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    try {
      await submitAssessment(jobId, candidateId, answers);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Failed to submit assessment");
    }
  };

  if (loading) return <div className="p-8 text-center text-lg text-blue-600">Loading assessment...</div>;
  if (!assessment) return <div className="p-8 text-center text-gray-500">No assessment found</div>;

  if (submitted) {
    // Show summary of answers after submission
    return (
      <div className="p-4 bg-white rounded-xl shadow-md border border-blue-100 text-center">
        <h2 className="text-2xl font-extrabold mb-4 text-blue-900 drop-shadow-sm">Assessment Submitted!</h2>
        <p className="mb-4 text-blue-700">Thank you for trying the assessment as a candidate. Here are your answers:</p>
        <div className="text-left mx-auto max-w-xl">
          {assessment.sections.map((section, idx) => (
            <div key={section.id} className="mb-4">
              <h3 className="font-bold text-lg text-blue-800 mb-2">Section {idx + 1}: {section.title}</h3>
              <ul className="space-y-2">
                {section.questions.map((q, qidx) => (
                  <li key={q.id} className="p-2 bg-blue-50 rounded">
                    <span className="font-semibold text-blue-700">Q{qidx + 1}:</span> {q.question}
                    <div className="ml-4 text-blue-900">
                      <span className="font-semibold">Your answer:</span> {Array.isArray(answers[q.id]) ? answers[q.id].join(", ") : (answers[q.id] || <span className="italic text-gray-400">No answer</span>)}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow-md border border-blue-100">
      <h2 className="text-2xl font-extrabold mb-4 text-blue-900 drop-shadow-sm">Assessment Form</h2>
      <div className="space-y-6">
        {assessment.sections.map((section, idx) => (
          <div key={section.id} className="mb-2 border-l-4 border-blue-400 bg-white rounded-lg shadow p-4">
            <h3 className="font-bold text-lg text-blue-800 mb-2">Section {idx + 1}: {section.title}</h3>
            <div className="space-y-2">
              {section.questions.map((q, qidx) => {
                const Comp = COMPONENT_MAP[q.type] || (() => <p>Unknown type</p>);
                return (
                  <div key={q.id} className="p-2 bg-blue-50 rounded flex items-center gap-2">
                    <span className="font-semibold text-blue-700">Q{qidx + 1}:</span>
                    <span className="flex-1">{q.question} <span className="text-xs text-gray-500">({q.type})</span></span>
                    {q.required && <span className="text-xs text-red-500 font-bold ml-2">*</span>}
                    <Comp
                      question={q}
                      value={answers[q.id]}
                      onChange={(val) => handleChange(q.id, val)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="mt-8 px-6 py-2 bg-blue-700 text-white rounded-lg shadow hover:bg-blue-800 font-bold text-lg"
      >
        Submit Assessment
      </button>
    </div>
  );
}

export default AssessmentForm;
