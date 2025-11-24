"use client";
import { useState, useRef, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateList } from "@/hooks/lists.hook";
import { useAuth } from "@/hooks/auth.hook";
import { toast } from "sonner";

interface AddListCardProps {
  boardID: string;
  nextIndex: number;
}

export const AddListCard = ({ boardID, nextIndex }: AddListCardProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState("");
  const [background, setBackground] = useState("#E5E7EB");
  const inputRef = useRef<HTMLInputElement>(null);
  const createList = useCreateList(boardID);
  const { user } = useAuth();

  // Colores predefinidos para las listas
  const colors = [
    "#E5E7EB", // Gray
    "#DBEAFE", // Blue
    "#FCE7F3", // Pink
    "#FEF3C7", // Yellow
    "#D1FAE5", // Green
    "#E0E7FF", // Indigo
  ];

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("El nombre de la lista es requerido");
      return;
    }

    if (!user?.$id) {
      toast.error("Debes iniciar sesión para crear listas");
      return;
    }

    try {
      await createList.mutateAsync({
        data: {
          name: name.trim(),
          index: nextIndex,
          background,
          isArchived: false,
          boardID,
        },
        userID: user.$id,
      });

      toast.success("Lista creada exitosamente");
      setName("");
      setBackground("#E5E7EB");
      setIsAdding(false);
    } catch (error) {
      toast.error("Error al crear la lista");
      console.error("Error creating list:", error);
    }
  };

  const handleCancel = () => {
    setName("");
    setBackground("#E5E7EB");
    setIsAdding(false);
  };

  if (!isAdding) {
    return (
      <div className="w-72 shrink-0">
        <Button
          onClick={() => setIsAdding(true)}
          variant="ghost"
          className="w-full h-auto p-4 bg-white/80 hover:bg-white border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-lg justify-start text-gray-600 hover:text-gray-900 transition-all"
        >
          <Plus className="h-5 w-5 mr-2" />
          Agregar lista
        </Button>
      </div>
    );
  }

  return (
    <div className="w-72 shrink-0">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Nombre de la lista"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-3 border-gray-300 text-black"
          maxLength={50}
        />

        <div className="mb-3">
          <label className="text-xs font-medium text-gray-600 mb-2 block">
            Color de fondo
          </label>
          <div className="flex gap-2">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setBackground(color)}
                className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer ${
                  background === color
                    ? "border-gray-900 scale-110"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Seleccionar color ${color}`}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            type="submit"
            size="sm"
            disabled={createList.isPending}
            className="flex-1 cursor-pointer"
          >
            {createList.isPending ? "Creando..." : "Agregar"}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="destructive"
            className="cursor-pointer hover:scale-105"
            onClick={handleCancel}
            disabled={createList.isPending}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};
