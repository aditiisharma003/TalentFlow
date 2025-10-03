// src/utils/formatters.js

// Utility: simulate network delay
export const delay = (ms = 500) => new Promise((res) => setTimeout(res, ms));

// Convert string to slug (lowercase, replace spaces/special chars)
export const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")       // Replace spaces with dash
    .replace(/[^\w-]+/g, "")    // Remove non-word chars
    .replace(/--+/g, "-");      // Replace multiple dashes with one

// Format a date to readable string
export const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Capitalize first letter of a string
export const capitalize = (str) =>
  str && str.length > 0 ? str.charAt(0).toUpperCase() + str.slice(1) : "";

// Format job or candidate status to readable string
export const formatStatus = (status) => {
  switch (status) {
    case "active":
      return "Active";
    case "archived":
      return "Archived";
    default:
      return capitalize(status);
  }
};
