import { createSessionClient } from "../appwrite/appwrite-server";
import { ID, Permission, Role, Query } from "node-appwrite";
import { Board, CreateBoard, BoardComplete, UpdateBoard } from "@/types/database.types";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const BOARDS_COLLECTION_ID = process.env
  .NEXT_PUBLIC_APPWRITE_BOARDS_COLLECTION_ID!;

export async function createBoard(
  data: CreateBoard,
  userID: string
): Promise<Board> {
  const { tablesDB } = await createSessionClient();
  return (await tablesDB.createRow(
    DATABASE_ID,
    BOARDS_COLLECTION_ID,
    ID.unique(),
    data,
    [
      Permission.read(Role.user(userID)), // Solo el usuario puede leer
      Permission.update(Role.user(userID)), // Solo el usuario puede actualizar
      Permission.delete(Role.user(userID)), // Solo el usuario puede eliminar
    ]
  )) as unknown as Board;
}

export async function getBoardsByUser(userID: string): Promise<Board[]> {
  const { tablesDB } = await createSessionClient();
  const result = await tablesDB.listRows(DATABASE_ID, BOARDS_COLLECTION_ID, [
    Query.equal("userID", userID),
  ]);
  return result.rows as unknown as Board[];
}

export async function updateBoard(
  boardID: string,
  data: UpdateBoard
): Promise<Board> {
  const { tablesDB } = await createSessionClient();
  return (await tablesDB.updateRow(
    DATABASE_ID,
    BOARDS_COLLECTION_ID,
    boardID,
    data
  )) as unknown as Board;
}

export async function getBoardComplete(
  boardID: string
): Promise<BoardComplete> {
  const { tablesDB } = await createSessionClient();
  return (await tablesDB.getRow(
    DATABASE_ID,
    BOARDS_COLLECTION_ID,
    boardID
  )) as unknown as BoardComplete;
}

export async function deleteBoard(boardID: string): Promise<void> {
  const { tablesDB } = await createSessionClient();
  await tablesDB.deleteRow(DATABASE_ID, BOARDS_COLLECTION_ID, boardID);
}