import { createSessionClient } from "../lib/appwrite/appwrite-server";
import { ID, Permission, Role, Query } from "node-appwrite";
import { Task } from "@/types/database.types";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const TASKS_COLLECTION_ID = process.env
    .NEXT_PUBLIC_APPWRITE_TASKS_COLLECTION_ID!;

export async function createTask(
    data: { title: string; description?: string; listID: string, index: number; isCompleted?: boolean },
    userID: string
): Promise<Task> {
    const { tablesDB } = await createSessionClient();
    await tablesDB.createRow(
        DATABASE_ID,
        TASKS_COLLECTION_ID,
        ID.unique(),
        data,
        [Permission.read(Role.user(userID)),
        Permission.update(Role.user(userID)),
        Permission.delete(Role.user(userID))]
    );
    return JSON.parse(JSON.stringify(data)) as Task;
}

export async function getTasksByList(listID: string): Promise<Task[]> {
    const { tablesDB } = await createSessionClient();
    const result = await tablesDB.listRows(DATABASE_ID, TASKS_COLLECTION_ID, [
        Query.equal("listID", listID),
    ]);
    return JSON.parse(JSON.stringify(result.rows)) as Task[];
}

export async function updateTask(
    taskID: string,
    data: { title?: string; description?: string; isCompleted?: boolean, priority?: number, dueTime?: string }
): Promise<Task> {
    const { tablesDB } = await createSessionClient();
    const result = await tablesDB.updateRow(
        DATABASE_ID,
        TASKS_COLLECTION_ID,
        taskID,
        data
    );
    return JSON.parse(JSON.stringify(result)) as Task;
}

export async function deleteTask(taskID: string): Promise<void> {
    const { tablesDB } = await createSessionClient();
    await tablesDB.deleteRow(DATABASE_ID, TASKS_COLLECTION_ID, taskID);
}