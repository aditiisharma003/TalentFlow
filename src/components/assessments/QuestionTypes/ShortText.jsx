import React from "react";

const ShortText = ({ question, value = "", onChange }) => {
  return (
    <div className="mb-4">
      <p className="font-medium">{question.question}</p>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border p-2 rounded w-full"
        maxLength={question.maxLength || 100}
        placeholder="Type your answer"
      />
    </div>
  );
};

export default ShortText;
