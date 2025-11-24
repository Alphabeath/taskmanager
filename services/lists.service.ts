"use server";
import { createSessionClient } from "../lib/appwrite/appwrite-server";
import { ID, Permission, Role, Query } from "node-appwrite";
import { List, ListWithTasks, UpdateList } from "@/types/database.types";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const LISTS_COLLECTION_ID = process.env
    .NEXT_PUBLIC_APPWRITE_LISTS_COLLECTION_ID!;

export async function createList(
    data: { name: string; boardID: string; index: number; background?:string; isArchived?: boolean },
    userID: string
): Promise<List> {
    const { tablesDB } = await createSessionClient();
    await tablesDB.createRow(
        DATABASE_ID,
        LISTS_COLLECTION_ID,
        ID.unique(),
        data,
        [Permission.read(Role.user(userID)),
        Permission.update(Role.user(userID)),
        Permission.delete(Role.user(userID))]
    );
    return JSON.parse(JSON.stringify(data)) as List;
}

export async function getListsByBoard(boardID: string): Promise<ListWithTasks[]> {
    const { tablesDB } = await createSessionClient();
    const result = await tablesDB.listRows(DATABASE_ID, LISTS_COLLECTION_ID, [
        Query.equal("boardID", boardID),
        Query.select(["*", "tasks.*"])
    ]);
    return JSON.parse(JSON.stringify(result.rows)) as ListWithTasks[];
}

export async function updateList(
    listID: string,
    data: UpdateList
): Promise<List> {
    const { tablesDB } = await createSessionClient();
    const result = await tablesDB.updateRow(
        DATABASE_ID,
        LISTS_COLLECTION_ID,
        listID,
        data
    );
    return JSON.parse(JSON.stringify(result)) as List;
}

export async function deleteList(listID: string): Promise<void> {
    const { tablesDB } = await createSessionClient();
    await tablesDB.deleteRow(DATABASE_ID, LISTS_COLLECTION_ID, listID);
}