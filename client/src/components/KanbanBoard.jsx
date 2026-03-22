import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

const STATUSES = ["Applied", "Interview", "Rejected"];

const KanbanBoard = ({ applications, onStatusChange }) => {
  const grouped = STATUSES.reduce((acc, status) => {
    acc[status] = applications.filter((a) => a.status === status);
    return acc;
  }, {});

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const from = result.source.droppableId;
    const to = result.destination.droppableId;
    if (from === to) return;
    const item = grouped[from][result.source.index];
    if (item) {
      onStatusChange(item._id, to);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid gap-4 md:grid-cols-3">
        {STATUSES.map((status) => (
          <Droppable key={status} droppableId={status}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="rounded-lg bg-white p-3 shadow">
                <h3 className="mb-3 font-semibold">{status}</h3>
                <div className="space-y-2">
                  {grouped[status].map((app, index) => (
                    <Draggable key={app._id} draggableId={app._id} index={index}>
                      {(dragProvided) => (
                        <div
                          ref={dragProvided.innerRef}
                          {...dragProvided.draggableProps}
                          {...dragProvided.dragHandleProps}
                          className="rounded border p-2 text-sm"
                        >
                          <p className="font-medium">{app.role}</p>
                          <p className="text-slate-600">{app.company}</p>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
