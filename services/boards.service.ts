"use server";
import { createSessionClient } from "../lib/appwrite/appwrite-server";
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
  const result = await tablesDB.createRow(
    DATABASE_ID,
    BOARDS_COLLECTION_ID,
    ID.unique(),
    data,
    [
      Permission.read(Role.user(userID)),
      Permission.update(Role.user(userID)),
      Permission.delete(Role.user(userID)),
    ]
  );
  return JSON.parse(JSON.stringify(result)) as Board;
}

export async function getBoardsByUser(userID: string): Promise<Board[]> {
  const { tablesDB } = await createSessionClient();
  const result = await tablesDB.listRows(DATABASE_ID, BOARDS_COLLECTION_ID, [
    Query.equal("userID", userID),
  ]);
  return JSON.parse(JSON.stringify(result.rows)) as Board[];
}

export async function updateBoard(
  boardID: string,
  data: UpdateBoard
): Promise<Board> {
  const { tablesDB } = await createSessionClient();
  const result = await tablesDB.updateRow(
    DATABASE_ID,
    BOARDS_COLLECTION_ID,
    boardID,
    data
  );
  return JSON.parse(JSON.stringify(result)) as Board;
}

export async function getBoardComplete(
  boardID: string
): Promise<BoardComplete> {
  const { tablesDB } = await createSessionClient();
  const result = await tablesDB.getRow(
    DATABASE_ID,
    BOARDS_COLLECTION_ID,
    boardID
  );
  return JSON.parse(JSON.stringify(result)) as BoardComplete;
}

export async function deleteBoard(boardID: string): Promise<void> {
  const { tablesDB } = await createSessionClient();
  await tablesDB.deleteRow(DATABASE_ID, BOARDS_COLLECTION_ID, boardID);
}