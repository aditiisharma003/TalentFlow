// src/utils/validators.js

// Check if a value is not empty
export const required = (value) => {
  if (!value || value.toString().trim() === "") {
    return "This field is required.";
  }
  return null;
};

// Validate numeric ranges
export const numericRange = (value, min, max) => {
  const num = Number(value);
  if (isNaN(num)) return "Must be a number.";
  if (num < min || num > max) return `Value must be between ${min} and ${max}.`;
  return null;
};

// Validate maximum string length
export const maxLength = (value, max) => {
  if (value && value.length > max) {
    return `Maximum length is ${max} characters.`;
  }
  return null;
};

// Unique slug validation (example using existing slugs)
export const uniqueSlug = (slug, existingSlugs = []) => {
  if (existingSlugs.includes(slug)) return "Slug must be unique.";
  return null;
};

// Conditional validation
export const requiredIf = (value, condition, message = "This field is required.") => {
  if (condition && (!value || value.toString().trim() === "")) return message;
  return null;
};
