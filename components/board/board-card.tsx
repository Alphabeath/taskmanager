import { Board, UpdateBoard } from "@/types/database.types";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Calendar,
  Layout,
  MoreHorizontal,
  Archive,
  Trash2,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BoardCardProps {
  board: Board;
  onDelete: (boardID: string) => Promise<void>;
  onArchive: (boardID: string, data: UpdateBoard) => Promise<void>;
}

export const BoardCard = ({ board, onDelete, onArchive }: BoardCardProps) => {
  const handleArchive = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await onArchive(board.$id, { isArchived: board.isArchived ? false : true });
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await onDelete(board.$id);
  };

  return (
    <Card className="group relative flex flex-col justify-between overflow-hidden transition-all hover:shadow-lg hover:border-primary/50 h-40">
      {/* Gradiente decorativo superior */}
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary to-primary/40" />

      <CardHeader className="pb-2 pt-2">
        {/* Contenedor Flex para alinear Título y Menú */}
        <div className="flex items-start justify-between gap-2">
          {/* Lado Izquierdo: Título y Fecha (Clickable) */}
          <Link
            href={`/dashboard/${board.$id}`}
            className="flex-1 min-w-0 space-y-1"
          >
            <CardTitle className="text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors">
              {board.name}
            </CardTitle>
            <CardDescription className="flex items-center text-xs">
              <Calendar className="mr-1.5 h-3 w-3" />
              {board.$createdAt
                ? format(new Date(board.$createdAt), "d 'de' MMMM, yyyy", {
                    locale: es,
                  })
                : "Fecha desconocida"}
            </CardDescription>
          </Link>

          {/* Lado Derecho: Menú Dropdown (Estático en su posición) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="-mt-1 h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Opciones</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleArchive}>
                <Archive className="mr-2 h-4 w-4" />
                Archivar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      {/* Pie de la tarjeta: "Ver tablero" también es un link */}
      <Link href={`/dashboard/${board.$id}`}>
        <CardContent>
          <div className="flex items-center text-muted-foreground text-xs">
            <Layout className="w-3 h-3 mr-1" />
            <span>Ver tablero</span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};
