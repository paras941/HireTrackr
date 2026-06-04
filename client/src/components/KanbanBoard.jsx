import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, GripVertical, Calendar, Trash2, ExternalLink } from "lucide-react";
import { useState } from "react";

const STATUSES = [
  { id: "Applied", label: "Applied", color: "from-blue-500 to-cyan-500", bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", icon: "📝" },
  { id: "Interview", label: "Interview", color: "from-emerald-500 to-teal-500", bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", icon: "🎯" },
  { id: "Rejected", label: "Rejected", color: "from-rose-500 to-pink-500", bg: "bg-rose-500/10", text: "text-rose-600 dark:text-rose-450", icon: "✋" },
];

const KanbanBoard = ({ applications = [], onStatusChange, onDelete }) => {
  const [draggingId, setDraggingId] = useState(null);

  const safeApplications = Array.isArray(applications) ? applications : [];

  const grouped = STATUSES.reduce((acc, status) => {
    acc[status.id] = safeApplications.filter((a) => a.status === status.id);
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
      year: "numeric"
    });
  };

  const getCompanyColor = (companyName) => {
    const colors = [
      "bg-indigo-500/10 text-indigo-500 dark:bg-indigo-400/10 dark:text-indigo-400 border-indigo-500/15 dark:border-indigo-400/15",
      "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-400/10 dark:text-emerald-400 border-emerald-500/15 dark:border-emerald-400/15",
      "bg-pink-500/10 text-pink-500 dark:bg-pink-400/10 dark:text-pink-400 border-pink-500/15 dark:border-pink-400/15",
      "bg-amber-500/10 text-amber-500 dark:bg-amber-400/10 dark:text-amber-400 border-amber-500/15 dark:border-amber-400/15",
      "bg-violet-500/10 text-violet-500 dark:bg-violet-400/10 dark:text-violet-400 border-violet-500/15 dark:border-violet-400/15",
      "bg-rose-500/10 text-rose-500 dark:bg-rose-450/10 dark:text-rose-450 border-rose-500/15 dark:border-rose-450/15",
    ];
    if (!companyName) return colors[0];
    const charCode = companyName.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  return (
    <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid gap-5 lg:grid-cols-3">
        {STATUSES.map((status) => (
          <Droppable key={status.id} droppableId={status.id}>
            {(provided, snapshot) => (
              <motion.div
                ref={provided.innerRef}
                {...provided.droppableProps}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className={`group relative min-h-[480px] overflow-hidden rounded-2xl p-5 transition-all duration-300 ${
                  snapshot.isDraggingOver
                    ? "bg-gradient-to-b from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/10 dark:to-purple-950/10 border-indigo-400/60 dark:border-indigo-500/30 shadow-lg shadow-indigo-500/5 ring-1 ring-indigo-400/30"
                    : "bg-white/60 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/80 shadow-sm"
                } border backdrop-blur-sm`}
              >
                {/* Accent Color Band */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${status.color}`} />
                
                {/* Column Header */}
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl" role="img" aria-label={status.label}>{status.icon}</span>
                    <div>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight">{status.label}</h3>
                      <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        {grouped[status.id].length} applications
                      </p>
                    </div>
                  </div>
                  <span className={`rounded-lg px-2.5 py-1 text-xs font-extrabold ${status.bg} ${status.text} border border-transparent`}>
                    {grouped[status.id].length}
                  </span>
                </div>

                {/* Cards Grid */}
                <div className="space-y-3 min-h-[380px]">
                  <AnimatePresence mode="popLayout">
                    {grouped[status.id].map((app, index) => (
                      <Draggable key={app._id} draggableId={app._id} index={index}>
                        {(dragProvided, dragSnapshot) => (
                          <motion.div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            whileHover={{ y: -2 }}
                            className={`group/card relative overflow-hidden rounded-xl border p-4 transition-all duration-200 ${
                              dragSnapshot.isDragging
                                ? "rotate-2 scale-103 shadow-2xl border-indigo-500/40 dark:border-indigo-400/40 bg-white dark:bg-slate-900 ring-2 ring-indigo-500/10"
                                : "bg-white dark:bg-slate-900/60 border-slate-200/50 dark:border-slate-800/80 hover:border-slate-350 dark:hover:border-slate-700 hover:shadow-md"
                            }`}
                          >
                            {/* Drag Handle */}
                            <div
                              {...dragProvided.dragHandleProps}
                              className="absolute left-1.5 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing p-1 rounded-md text-slate-300 dark:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-slate-500 dark:hover:text-slate-400 transition-colors opacity-0 group-hover/card:opacity-100"
                            >
                              <GripVertical className="h-4 w-4" />
                            </div>

                            {/* Card Body */}
                            <div className="ml-3.5">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-bold text-slate-850 dark:text-white text-sm tracking-tight truncate">
                                    {app.role}
                                  </h4>
                                  <div className="mt-1 flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                    {/* Company Icon Initials */}
                                    <span className={`inline-flex h-5 w-5 items-center justify-center rounded-md border text-[9px] font-bold ${getCompanyColor(app.company)}`}>
                                      {app.company?.slice(0, 2).toUpperCase()}
                                    </span>
                                    <span className="truncate">{app.company}</span>
                                  </div>
                                </div>

                                {/* Score Badge */}
                                {app.atsScore > 0 && (
                                  <div
                                    className={`rounded-lg px-2 py-1 text-[10px] font-extrabold shadow-sm shrink-0 border ${
                                      app.atsScore >= 70
                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 border-emerald-500/15"
                                        : app.atsScore >= 40
                                        ? "bg-amber-500/10 text-amber-605 dark:text-amber-400 border-amber-500/15"
                                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/15"
                                    }`}
                                  >
                                    ⚡ {app.atsScore}%
                                  </div>
                                )}
                              </div>

                              {/* Description Notes */}
                              {app.notes && (
                                <p className="mt-3 line-clamp-2 text-xs font-medium text-slate-500 dark:text-slate-400 leading-normal">
                                  {app.notes}
                                </p>
                              )}

                              {/* Missing Keywords list */}
                              {app.missingKeywords?.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-1">
                                  {app.missingKeywords.slice(0, 3).map((keyword) => (
                                    <span
                                      key={keyword}
                                      className="rounded bg-slate-100 dark:bg-slate-800 border border-slate-200/10 px-1.5 py-0.5 text-[9px] font-semibold text-slate-550 dark:text-slate-400"
                                    >
                                      {keyword}
                                    </span>
                                  ))}
                                  {app.missingKeywords.length > 3 && (
                                    <span className="rounded bg-slate-100 dark:bg-slate-850 px-1.5 py-0.5 text-[9px] font-bold text-slate-400">
                                      +{app.missingKeywords.length - 3}
                                    </span>
                                  )}
                                </div>
                              )}

                              {/* Card Footer controls */}
                              <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-850/60 pt-3">
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500">
                                  <Calendar className="h-3.5 w-3.5" />
                                  <span>{formatDate(app.appliedDate)}</span>
                                </div>

                                <div className="flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200">
                                  <button
                                    className="rounded-lg p-1.5 text-slate-400 dark:text-slate-550 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                                    title="View Job Details"
                                  >
                                    <ExternalLink className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    className="rounded-lg p-1.5 text-slate-400 dark:text-slate-550 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                                    title="Delete Application"
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

                  {/* Empty Stage State */}
                  {grouped[status.id].length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 py-14 text-center"
                    >
                      <div className={`mb-3.5 flex h-11 w-11 items-center justify-center rounded-xl ${status.bg} ${status.text}`}>
                        <Briefcase className="h-5 w-5" />
                      </div>
                      <p className="text-xs font-bold text-slate-600 dark:text-slate-400">No {status.label.toLowerCase()} jobs</p>
                      <p className="mt-1 text-[10px] font-semibold text-slate-400 dark:text-slate-500">Drag & drop cards here</p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
