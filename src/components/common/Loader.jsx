// src/components/common/Loader.jsx
import React from "react";

export default function Loader({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin mb-4"></div>
      <p className="text-gray-700">{message}</p>
    </div>
  );
}
