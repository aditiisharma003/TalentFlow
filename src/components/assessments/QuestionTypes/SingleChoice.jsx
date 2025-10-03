import React from "react";

const SingleChoice = ({ question, value, onChange }) => {
  return (
    <div className="mb-4">
      <p className="font-medium">{question.question}</p>
      {question.options.map((opt, idx) => (
        <label key={idx} className="flex items-center gap-2 mt-1">
          <input
            type="radio"
            name={question.id}
            value={opt}
            checked={value === opt}
            onChange={(e) => onChange(e.target.value)}
            className="form-radio"
          />
          {opt}
        </label>
      ))}
    </div>
  );
};

export default SingleChoice;
