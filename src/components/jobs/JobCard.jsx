import React from "react";
import { formatDate } from "../../utils/formatters";
import {
  FaCheckCircle,
  FaArchive,
  FaEdit,
  FaEye,
  FaTag,
  FaBuilding,
  FaTrash,
} from "react-icons/fa";

// Small reusable action button
function JobActionButton({ onClick, icon: Icon, label, colorClass, title }) {
  // colorClass should be full classes like: "bg-red-500 hover:bg-red-600"
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-1 rounded-lg text-white text-sm font-medium shadow transition duration-150 ${colorClass}`}
      title={title}
    >
      <Icon /> <span>{label}</span>
    </button>
  );
}

// Status → style mapping
const STATUS_STYLES = {
  active: { bg: "bg-green-100", text: "text-green-800", icon: "text-green-500" },
  open: { bg: "bg-green-100", text: "text-green-800", icon: "text-green-500" },
  archived: { bg: "bg-gray-200", text: "text-gray-700", icon: "text-gray-500" },
};

export default function JobCard({ job, onEdit, onArchive, onView, onDelete }) {
  const statusStyle = STATUS_STYLES[(job?.status || "").toLowerCase()] || STATUS_STYLES.archived;

  const isActiveish = (job?.status === "active" || job?.status === "open");

  return (
    <div
      className="relative border rounded-xl p-6 flex justify-between items-start bg-gradient-to-br from-white via-blue-50 to-blue-100 shadow-lg transition-transform hover:scale-[1.025] hover:shadow-2xl group duration-200"
      style={{ minHeight: 170 }}
    >
      {/* Company/Logo Avatar */}
      <div className="flex flex-col items-center mr-5 z-10">
        <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 text-2xl shadow-md mb-2">
          <FaBuilding />
        </div>
        <span className="text-xs text-gray-400 mt-1">
          {job?.company || "Company"}
        </span>
      </div>

      <div className="flex-1 z-10">
        <h3 className="text-xl font-bold text-blue-900 flex items-center gap-2">
          <span>{job?.title}</span>
          {isActiveish && (
            <FaCheckCircle className="text-green-500" title="Active" />
          )}
        </h3>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {job?.description || "No description"}
        </p>

        <div className="mt-3 flex flex-wrap gap-2 items-center">
          <span
            className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-semibold shadow-sm ${statusStyle.bg} ${statusStyle.text}`}
          >
            <FaCheckCircle className={`text-xs ${statusStyle.icon}`} />
            {(job?.status || "unknown").toLowerCase()}
          </span>

          {job?.tags?.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium"
            >
              <FaTag className="text-blue-400" />
              {t}
            </span>
          ))}
        </div>

        <p className="text-xs text-gray-400 mt-4">
          Updated:{" "}
          {job?.updatedAt ? formatDate(job.updatedAt) : formatDate(job?.createdAt)}
        </p>
      </div>

      {/* Actions */}
      <div className="ml-6 flex flex-col gap-2 items-end z-10">
        <JobActionButton
          onClick={() => onDelete(job)}
          icon={FaTrash}
          label="Delete"
          colorClass="bg-red-500 hover:bg-red-600"
          title="Delete Job"
        />
        <JobActionButton
          onClick={() => onView(job)}
          icon={FaEye}
          label="View"
          colorClass="bg-indigo-500 hover:bg-indigo-600"
          title="View Job"
        />
        <JobActionButton
          onClick={() => onEdit(job)}
          icon={FaEdit}
          label="Edit"
          colorClass="bg-blue-500 hover:bg-blue-600"
          title="Edit Job"
        />
        <JobActionButton
          onClick={() => onArchive(job)}
          icon={FaArchive}
          label={isActiveish ? "Archive" : "Unarchive"}
          colorClass={isActiveish ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
          title={isActiveish ? "Archive Job" : "Unarchive Job"}
        />
      </div>

      {/* Decorative background effect */}
      <div className="absolute inset-0 pointer-events-none rounded-xl group-hover:opacity-100 opacity-0 transition duration-200 bg-gradient-to-tr from-blue-100/40 to-transparent z-0" />
    </div>
  );
}
