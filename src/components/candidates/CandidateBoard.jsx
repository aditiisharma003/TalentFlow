// src/components/candidates/CandidateBoard.jsx
import React, { useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../common/Loader";
import { CANDIDATE_STAGES } from "../../utils/constants";
import {
  fetchCandidates,
  updateCandidateStage,
  selectCandidates, // ✅ Import the selector
  selectCandidatesLoading,
  selectCandidatesError,
} from "../../app/slices/candidatesSlice";

const CandidateBoard = () => {
  const dispatch = useDispatch();
  
  // ✅ Use the imported selectors
  const candidates = useSelector(selectCandidates);
  const loading = useSelector(selectCandidatesLoading);
  const error = useSelector(selectCandidatesError);

  // Fetch all candidates from API/IndexedDB
  useEffect(() => {
    dispatch(fetchCandidates());
  }, [dispatch]);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 mb-4">Error: {error}</p>
        <button
          onClick={() => dispatch(fetchCandidates())}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  // Group candidates by stage
  const columns = CANDIDATE_STAGES.reduce((acc, stage) => {
    acc[stage] = candidates.filter((c) => c.stage === stage);
    return acc;
  }, {});

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const candidateId = result.draggableId;
    const sourceStage = source.droppableId;
    const destStage = destination.droppableId;

    if (sourceStage === destStage && source.index === destination.index) return;

    // ✅ Dispatch the correct action
    dispatch(updateCandidateStage({ id: candidateId, stage: destStage }));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Candidate Pipeline</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {CANDIDATE_STAGES.map((stage) => (
            <Droppable droppableId={stage} key={stage}>
              {(provided, snapshot) => (
                <div
                  className={`bg-gray-100 rounded-lg p-3 min-w-[280px] flex-shrink-0 ${
                    snapshot.isDraggingOver ? "bg-blue-50" : ""
                  }`}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg">
                      {stage.charAt(0).toUpperCase() + stage.slice(1)}
                    </h3>
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      {columns[stage].length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {columns[stage].map((c, index) => (
                      <Draggable key={c.id} draggableId={c.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-white p-3 rounded-lg shadow-sm cursor-move transition-all ${
                              snapshot.isDragging
                                ? "shadow-lg ring-2 ring-blue-400"
                                : "hover:shadow-md"
                            }`}
                          >
                            <p className="font-medium text-sm">{c.name}</p>
                            <p className="text-xs text-gray-500 mt-1">{c.email}</p>
                            {c.jobId && (
                              <p className="text-xs text-gray-400 mt-1">
                                Job: {c.jobId.slice(0, 8)}...
                              </p>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    
                    {columns[stage].length === 0 && (
                      <div className="text-center text-gray-400 text-sm py-8">
                        Drop candidates here
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default CandidateBoard;