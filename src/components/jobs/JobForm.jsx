import React, { useEffect, useState } from "react";
import Modal from "../common/Modal";
import { useDispatch, useSelector } from "react-redux";
import {
  createJob as createJobThunk,
  updateJob as updateJobThunk,
} from "../../app/slices/jobsSlice";
import { required, uniqueSlug } from "../../utils/validators";
import { slugify } from "../../utils/formatters";

export default function JobForm({ isOpen, onClose, editingJob }) {
  const dispatch = useDispatch();
  // support both shapes: items OR items.results
  const allJobsState = useSelector((state) => state.jobs.items);
  const allJobs = Array.isArray(allJobsState)
    ? allJobsState
    : Array.isArray(allJobsState?.results)
    ? allJobsState.results
    : [];

  const [title, setTitle] = useState(editingJob?.title || "");
  const [slug, setSlug] = useState(editingJob?.slug || "");
  const [description, setDescription] = useState(editingJob?.description || "");
  const [status, setStatus] = useState(editingJob?.status || "active");
  const [tags, setTags] = useState((editingJob?.tags || []).join(", "));
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingJob) {
      setTitle(editingJob.title || "");
      setSlug(editingJob.slug || "");
      setDescription(editingJob.description || "");
      setStatus(editingJob.status || "active");
      setTags((editingJob.tags || []).join(", "));
    } else {
      setTitle("");
      setSlug("");
      setDescription("");
      setStatus("active");
      setTags("");
    }
    setError(null);
  }, [editingJob, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // required validation
    const r = required(title);
    if (r) {
      setError(r);
      return;
    }

    const finalSlug = slug ? slugify(slug) : slugify(title);
    const existingSlugs = (allJobs || [])
      .map((j) => j.slug)
      .filter((s) => s && s !== (editingJob?.slug || null));

    const us = uniqueSlug(finalSlug, existingSlugs);
    if (us) {
      setError(us);
      return;
    }

    const payload = {
      title: title.trim(),
      slug: finalSlug,
      description: description.trim(),
      status,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      setSaving(true);
      if (editingJob?.id) {
        await dispatch(
          updateJobThunk({ id: editingJob.id, data: payload })
        ).unwrap();
      } else {
        await dispatch(createJobThunk(payload)).unwrap();
      }
      onClose();
    } catch (err) {
      setError(err?.message || "Failed to save job");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingJob ? "Edit Job" : "Create Job"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && <div className="text-red-600 text-sm">{error}</div>}

        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            className="border p-2 rounded w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Frontend Developer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Slug (optional)
          </label>
          <input
            className="border p-2 rounded w-full"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="frontend-developer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            className="border p-2 rounded w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              className="border p-2 rounded w-full"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="active">Active</option>
              <option value="archived">Archived</option>
              <option value="open">Open</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              Tags (comma separated)
            </label>
            <input
              className="border p-2 rounded w-full"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="react,frontend"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
