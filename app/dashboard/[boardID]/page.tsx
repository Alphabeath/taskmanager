"use client"
import { useBoard } from "@/hooks/boards.hook";
import { useAuth } from "@/hooks/auth.hook";
export default function Page({ params }: { params: { boardID: string } }) {
  const { user } = useAuth();
  const { board, isLoading } = useBoard(params.boardID);
  return <div>prueba</div>;
}
