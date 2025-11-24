"use client";
import { BoardList } from "@/components/board/board-list";
import { useAuth } from "@/hooks/auth.hook";

export default function Page() {
  const { user } = useAuth();
  return <div>{user && <BoardList userId={user.$id} />}</div>;
}
