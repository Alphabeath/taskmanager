import React, { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreateBoard } from "@/types/database.types";


interface CreateBoardButtonProps {
  userId: string;
  onCreate: (data: CreateBoard) => Promise<void>;
  isCreating: boolean;
}

export const CreateBoardButton = ({ userId, onCreate, isCreating }: CreateBoardButtonProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Construcción estricta del tipo CreateBoard
    const newBoardData: CreateBoard = {
      name: name,
      userID: userId,
      isArchived: false, // Valor por defecto según tu tipo
      // background: "default" // Si agregas propiedad de fondo en el futuro
    };

    try {
      await onCreate(newBoardData);
      setOpen(false);
      setName("");
      toast.success("Tablero creado exitosamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al crear el tablero");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="h-40 w-full rounded-xl border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30 transition-all flex flex-col items-center justify-center text-muted-foreground hover:text-primary gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <div className="p-3 rounded-full bg-muted group-hover:accent-accent shadow-sm transition-all group-hover:scale-110">
            <Plus className="h-6 w-6" />
          </div>
          <span className="font-medium text-sm">Crear nuevo tablero</span>
        </button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear tablero</DialogTitle>
            <DialogDescription>
              Añade un nuevo espacio de trabajo para organizar tus tareas.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">Nombre del tablero</label>
              <Input
                id="name"
                placeholder="Ej: Desarrollo web, Marketing..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                disabled={isCreating}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isCreating || !name.trim()}>
              {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isCreating ? "Creando..." : "Crear tablero"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};