import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, GripVertical, Calendar, MoreHorizontal, Trash2, ExternalLink } from "lucide-react";
import { useState } from "react";

const STATUSES = [
  { id: "Applied", label: "Applied", color: "from-blue-500 to-indigo-600", bg: "bg-blue-50", text: "text-blue-700" },
  { id: "Interview", label: "Interview", color: "from-green-500 to-emerald-600", bg: "bg-green-50", text: "text-green-700" },
  { id: "Rejected", label: "Rejected", color: "from-red-500 to-pink-600", bg: "bg-red-50", text: "text-red-700" },
];

const KanbanBoard = ({ applications, onStatusChange, onDelete }) => {
  const [draggingId, setDraggingId] = useState(null);

  const grouped = STATUSES.reduce((acc, status) => {
    acc[status.id] = applications.filter((a) => a.status === status.id);
    return acc;
  }, {});

  const handleDragStart = (result) => {
    setDraggingId(result.draggableId);
  };

  const handleDragEnd = (result) => {
    setDraggingId(null);
    if (!result.destination) return;
    const from = result.source.droppableId;
    const to = result.destination.droppableId;
    if (from === to) return;
    const item = grouped[from][result.source.index];
    if (item) {
      onStatusChange(item._id, to);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid gap-4 lg:grid-cols-3">
        {STATUSES.map((status) => (
          <Droppable key={status.id} droppableId={status.id}>
            {(provided, snapshot) => (
              <motion.div
                ref={provided.innerRef}
                {...provided.droppableProps}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`min-h-[400px] rounded-2xl p-4 transition-all duration-300 ${
                  snapshot.isDraggingOver
                    ? "bg-indigo-50 ring-2 ring-indigo-400 ring-offset-2"
                    : "bg-slate-50/80"
                }`}
              >
                {/* Column Header */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full bg-gradient-to-r ${status.color}`} />
                    <h3 className="font-semibold text-slate-900">{status.label}</h3>
                    <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${status.bg} ${status.text}`}>
                      {grouped[status.id].length}
                    </span>
                  </div>
                </div>

                {/* Cards Container */}
                <div className="space-y-3">
                  <AnimatePresence>
                    {grouped[status.id].map((app, index) => (
                      <Draggable key={app._id} draggableId={app._id} index={index}>
                        {(dragProvided, dragSnapshot) => (
                          <motion.div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            className={`group relative overflow-hidden rounded-xl bg-white p-4 shadow-sm transition-all duration-200 ${
                              dragSnapshot.isDragging
                                ? "rotate-2 scale-105 shadow-2xl ring-2 ring-indigo-400"
                                : "hover:shadow-md"
                            }`}
                          >
                            {/* Drag Handle */}
                            <div
                              {...dragProvided.dragHandleProps}
                              className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
                            >
                              <GripVertical className="h-4 w-4 text-slate-400" />
                            </div>

                            {/* Card Content */}
                            <div className="ml-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-slate-900">{app.role}</h4>
                                  <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                                    <Briefcase className="h-3.5 w-3.5" />
                                    <span>{app.company}</span>
                                  </div>
                                </div>

                                {/* ATS Score Badge */}
                                {app.atsScore > 0 && (
                                  <div
                                    className={`rounded-lg px-2 py-1 text-xs font-semibold ${
                                      app.atsScore >= 70
                                        ? "bg-green-100 text-green-700"
                                        : app.atsScore >= 40
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-red-100 text-red-700"
                                    }`}
                                  >
                                    {app.atsScore}%
                                  </div>
                                )}
                              </div>

                              {/* Notes */}
                              {app.notes && (
                                <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                                  {app.notes}
                                </p>
                              )}

                              {/* Missing Keywords */}
                              {app.missingKeywords?.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-1">
                                  {app.missingKeywords.slice(0, 3).map((keyword) => (
                                    <span
                                      key={keyword}
                                      className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                                    >
                                      {keyword}
                                    </span>
                                  ))}
                                  {app.missingKeywords.length > 3 && (
                                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                                      +{app.missingKeywords.length - 3}
                                    </span>
                                  )}
                                </div>
                              )}

                              {/* Footer */}
                              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                                <div className="flex items-center gap-1 text-xs text-slate-400">
                                  <Calendar className="h-3.5 w-3.5" />
                                  <span>{formatDate(app.appliedDate)}</span>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                  <button
                                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                                    title="View details"
                                  >
                                    <ExternalLink className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                                    title="Delete"
                                    onClick={() => onDelete?.(app._id)}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </Draggable>
                    ))}
                  </AnimatePresence>

                  {provided.placeholder}

                  {/* Empty State */}
                  {grouped[status.id].length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 py-12 text-center"
                    >
                      <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full ${status.bg}`}>
                        <Briefcase className={`h-6 w-6 ${status.text}`} />
                      </div>
                      <p className="text-sm font-medium text-slate-500">No {status.label.toLowerCase()} jobs</p>
                      <p className="mt-1 text-xs text-slate-400">Drag cards here</p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </Droppable>
        ))}
      </div>

      {/* Drag Overlay Visual Feedback */}
      {draggingId && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-indigo-500/5" />
        </div>
      )}
    </DragDropContext>
  );
};

export default KanbanBoard;
