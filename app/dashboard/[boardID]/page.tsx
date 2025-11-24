"use client";

import { useBoard } from "@/hooks/boards.hook";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button"; // Opcional, para acciones futuras from "@/components/ui/card";
import { use } from "react";
import { MoreHorizontal } from "lucide-react"; // Iconos recomendados

interface PageProps {
  params: Promise<{ boardID: string }>;
}

export default function Page({ params }: PageProps) {
  // Desempaquetamos params
  const { boardID } = use(params);
  const { board, isLoading } = useBoard(boardID);

  // 1. ESTADO DE CARGA (Skeleton UI)
  if (isLoading || !board) {
    return (
      <div className="flex flex-col h-full p-3 gap-6 rounded-sm">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center  rounded-sm">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>

        {/* Lists Skeleton (Scroll horizontal simulado) */}
        <div className="flex gap-4 overflow-hidden h-full bg-muted/50 rounded-sm p-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-full w-72 rounded-xl shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  // Formateo simple de fecha
  const lastEdited = board.$updatedAt
    ? new Date(board.$updatedAt).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Fecha no disponible";

  // 2. UI PRINCIPAL
  return (
    <div className="flex flex-col h-full">
      {/* --- ZONA SUPERIOR: HEADER DEL TABLERO --- */}
      <header className="flex items-center justify-between px-3 py-3 top-0 z-10 rounded-sm mb-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            {board.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            Última edición: {lastEdited}
          </p>
        </div>

        {/* Botones de acción del tablero (Configuración, Filtros, etc.) */}
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </header>

      {/* --- ZONA INFERIOR: CANVAS DE LISTAS --- */}
      <main className="flex-1 overflow-x-auto overflow-y-hidden p-6 bg-muted/50 rounded-sm">
        <div className="flex h-full gap-6 items-start"></div>
      </main>
    </div>
  );
}
