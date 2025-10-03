import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useDispatch } from "react-redux";
import { reorderJob as reorderJobThunk } from "../../app/slices/jobsSlice";

export default function JobReorder({ jobs = [], onLocalReorder }) {
  const dispatch = useDispatch();
  const [items, setItems] = useState(jobs);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setItems(jobs);
  }, [jobs]);

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const fromIndex = result.source.index;
    const toIndex = result.destination.index;
    if (fromIndex === toIndex) return;

    // Keep a snapshot of original items so we can compute original orders
    const original = Array.from(items);

    const next = Array.from(items);
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);

    setItems(next);
    if (onLocalReorder) onLocalReorder(next);

    try {
      setIsSaving(true);

      // get original orders (before the move)
      const fromOrder = original[fromIndex]?.order;
      const toOrder = original[toIndex]?.order;

      // dispatch reorder thunk; thunk implementation may accept fromOrder/toOrder
      const resultData = await dispatch(
        reorderJobThunk({ fromOrder, toOrder })
      ).unwrap();

      // If backend returns the full updated list, use it; otherwise keep local next
      if (Array.isArray(resultData)) {
        setItems(resultData);
        if (onLocalReorder) onLocalReorder(resultData);
      } else {
        // no array returned, keep next as is
      }
    } catch (err) {
      // revert
      setItems(jobs);
      if (onLocalReorder) onLocalReorder(jobs);
      alert("Failed to reorder jobs: " + (err?.message || "Unknown error"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      {isSaving && (
        <div className="text-sm text-gray-500 mb-2 flex items-center gap-2">
          <span className="animate-spin border-2 border-gray-300 border-t-blue-500 rounded-full w-4 h-4"></span>
          Saving new order...
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="jobs-droppable">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex flex-col gap-2"
            >
              {items.map((job, index) => (
                <Draggable key={job.id} draggableId={String(job.id)} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`p-3 bg-white border rounded flex justify-between items-center ${
                        snapshot.isDragging ? "bg-blue-50 shadow" : ""
                      }`}
                    >
                      <div>
                        <div className="font-medium">{job.title}</div>
                        <div className="text-xs text-gray-500">{job.slug}</div>
                      </div>
                      <div className="text-xs text-gray-400">
                        Order: {job.order}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
