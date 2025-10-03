import React from "react";

const MultiChoice = ({ question, value = [], onChange }) => {
  const toggleOption = (opt) => {
    if (value.includes(opt)) {
      onChange(value.filter((v) => v !== opt));
    } else {
      onChange([...value, opt]);
    }
  };

  return (
    <div className="mb-4">
      <p className="font-medium">{question.question}</p>
      {question.options.map((opt, idx) => (
        <label key={idx} className="flex items-center gap-2 mt-1">
          <input
            type="checkbox"
            checked={value.includes(opt)}
            onChange={() => toggleOption(opt)}
            className="form-checkbox"
          />
          {opt}
        </label>
      ))}
    </div>
  );
};

export default MultiChoice;
