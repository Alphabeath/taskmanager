"use client";

// Hooks y Tipos
import { useBoards } from "@/hooks/boards.hook";
import { Board } from "@/types/database.types"; // Tu archivo de tipos
import { Skeleton } from "@/components/ui/skeleton";

import { BoardCard } from "./board-card";
import { CreateBoardButton } from "./create-button-board";


// --- 3. Componente Principal: Lista de Tableros ---
interface BoardListProps {
  userId: string;
}

export function BoardList({ userId }: BoardListProps) {
  // Obtenemos los métodos del hook que ya definiste
  const { boards, isLoading, createBoardAsync, isCreating, deleteBoardAsync, updateBoardAsync } = useBoards(userId);

  if (isLoading) {
    return <BoardListSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {/* Botón de crear siempre primero o último según preferencia. Aquí está primero */}
      <CreateBoardButton
        userId={userId}
        onCreate={async (data) => {
          await createBoardAsync(data);
        }}
        isCreating={isCreating}
      />

      {/* Lista de tableros ordenados por fecha (asumiendo que vienen ordenados o los ordenas aquí) */}
      {boards?.map((board: Board) => (
        <div
          key={board.$id}
          className="animate-in fade-in zoom-in duration-300"
        >
          <BoardCard
            board={board}
            onArchive={async () => {
              await updateBoardAsync({ boardID: board.$id, data: board.isArchived ? { isArchived: false } : { isArchived: true } });
            }}
            onDelete={async () => {
              await deleteBoardAsync(board.$id)
            }}
          />
        </div>
      ))}
    </div>
  );
}

// --- 4. Skeleton de carga ---
function BoardListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-40 w-full rounded-xl" />
      ))}
    </div>
  );
}
