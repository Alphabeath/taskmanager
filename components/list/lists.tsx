"use client"
import { useEffect, useState } from "react";
import { ListWithTasks } from "@/types/database.types";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { AddListCard } from "./add-list-card";

interface ListsProps {
  lists: ListWithTasks[];
  boardID: string;
}

export const Lists = ({ lists, boardID }: ListsProps) => {
  // Estado para asegurar que solo renderizamos en el cliente
  // Esto evita errores de Hidratación en Next.js / React 18
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Usar requestAnimationFrame para evitar cascading renders
    requestAnimationFrame(() => {
      setIsMounted(true);
    });
  }, []);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    // Si no hay destino (se soltó fuera), no hacer nada
    if (!destination) return;

    // Si se soltó en el mismo lugar, no hacer nada
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Lógica de reordenamiento según el tipo
    if (type === "list") {
      // TODO: Implementar reordenamiento de listas/columnas
      console.log("Reordenar lista:", { source, destination });
    } else if (type === "card") {
      // TODO: Implementar reordenamiento de tareas
      console.log("Reordenar tarea:", { source, destination });
    }
  };

  if (!isMounted) {
    // Skeleton loader mientras se monta el componente
    return (
      <div className="flex gap-6 h-full">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-md w-72 shrink-0 h-96 animate-pulse"
          >
            <div className="h-14 bg-gray-200 rounded-t-lg" />
            <div className="p-4 space-y-2">
              <div className="h-16 bg-gray-200 rounded" />
              <div className="h-16 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {/* Droppable para las COLUMNAS (Horizontal) */}
      <Droppable droppableId="all-lists" direction="horizontal" type="list">
        {(provided) => (
          <div
            className="flex gap-6 h-full overflow-x-auto pb-4"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {lists.map((list, index) => (
              <Draggable key={list.$id} draggableId={list.$id} index={index}>
                {(provided) => (
                  <div
                    className="rounded-lg shadow-md w-72 shrink-0 flex flex-col overflow-hidden text-black"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={{
                      backgroundColor: list.background || "#E5E7EB",
                      ...provided.draggableProps.style,
                    }}
                  >
                    {/* El dragHandleProps va en el título para arrastrar la lista desde ahí */}
                    <div
                      {...provided.dragHandleProps}
                      className="font-bold p-4 border-b border-black/10 cursor-grab active:cursor-grabbing"
                    >
                      {list.name}
                    </div>

                    {/* Droppable para las TAREAS (Vertical) dentro de la lista */}
                    <Droppable droppableId={list.$id} type="card">
                      {(provided, snapshot) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className={`p-4 flex-1 min-h-[200px] transition-colors ${
                            snapshot.isDraggingOver ? "bg-black/5" : ""
                          }`}
                        >
                          {(list.tasks ?? []).map((task, taskIndex) => (
                            <Draggable
                              key={task.$id}
                              draggableId={task.$id}
                              index={taskIndex}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`bg-gray-100 p-2 mb-2 rounded shadow-sm text-sm cursor-pointer hover:bg-gray-200 transition ${
                                    snapshot.isDragging
                                      ? "opacity-50 rotate-2 shadow-lg"
                                      : ""
                                  }`}
                                >
                                  {task.title}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            
            {/* Componente para agregar nuevas listas */}
            <AddListCard boardID={boardID} nextIndex={lists.length} />
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
