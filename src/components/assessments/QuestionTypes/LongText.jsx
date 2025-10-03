import React from "react";

const LongText = ({ question, value = "", onChange }) => {
  return (
    <div className="mb-4">
      <p className="font-medium">{question.question}</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border p-2 rounded w-full"
        rows={4}
        maxLength={question.maxLength || 500}
        placeholder="Type your answer"
      />
    </div>
  );
};

export default LongText;
