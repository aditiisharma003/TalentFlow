import React from "react";
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

function AssessmentPreview({ assessment }) {
  if (!assessment) return <div className="p-8 text-center text-gray-500">No assessment to preview</div>;

  return (
  <div className="p-4 bg-white rounded-xl shadow-md border border-blue-100">
      <h2 className="text-2xl font-extrabold mb-4 text-blue-900 drop-shadow-sm">Live Assessment Preview</h2>
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
                    <Comp question={q} />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AssessmentPreview;
