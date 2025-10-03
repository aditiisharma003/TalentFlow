import React from "react";

const NumericInput = ({ question, value = "", onChange }) => {
  return (
    <div className="mb-4">
      <p className="font-medium">{question.question}</p>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border p-2 rounded w-full"
        min={question.min}
        max={question.max}
        placeholder="Enter a number"
      />
    </div>
  );
};

export default NumericInput;
