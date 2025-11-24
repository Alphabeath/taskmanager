import { ListWithTasks } from "@/types/database.types";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DragDropContextProps,
  DroppableProps,
  DraggableProps,
} from "@hello-pangea/dnd";

export const Lists = (props: DragDropContextProps, lists: ListWithTasks) => {
  return (
    <DragDropContext onDragEnd={props.onDragEnd}>
      <div className="flex gap-4 overflow-x-auto h-full bg-muted/50 rounded-sm p-4">E
        {/* Aquí irían los componentes de las listas */}
      </div>
    </DragDropContext>
  );
};
