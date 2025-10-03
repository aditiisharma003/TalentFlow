import React from "react";

const FileUploadStub = ({ question }) => {
  return (
    <div className="mb-4">
      <p className="font-medium">{question.question}</p>
      <input type="file" disabled className="border p-2 rounded w-full bg-gray-100 cursor-not-allowed" />
      <p className="text-sm text-gray-500 mt-1">File upload is a stub in this project.</p>
    </div>
  );
};

export default FileUploadStub;
