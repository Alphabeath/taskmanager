// Tipos para las colecciones de Appwrite

export interface Board {
  $id: string;
  name: string;
  userID: string;
  isArchived: boolean;
  $createdAt?: string;
  $updatedAt?: string;
}

export interface List {
  $id: string;
  name: string;
  boardID: string;
  background: string;
  index: number;
  isArchived: boolean;
  $createdAt?: string;
  $updatedAt?: string;
}

export interface Task {
  $id: string;
  title: string;
  description?: string;
  index: number;
  priority: number;
  isCompleted: boolean;
  dueDate?: string;
  listID: string;
  $createdAt?: string;
  $updatedAt?: string;
}

// Tipos extendidos con relaciones
export interface BoardWithLists extends Board {
  lists?: List[];
}

export interface ListWithTasks extends List {
  tasks?: Task[];
}

export interface BoardComplete extends Board {
  lists?: ListWithTasks[];
}

// Tipos para crear nuevos registros (sin ID)
export type CreateBoard = Omit<Board, "$id" | "$createdAt" | "$updatedAt">;
export type CreateList = Omit<List, "$id" | "$createdAt" | "$updatedAt" >;
export type CreateTask = Omit<Task, "$id" | "$createdAt" | "$updatedAt">;

// Tipos para actualizar registros
export type UpdateBoard = Partial<CreateBoard>;
export type UpdateList = Partial<CreateList>;
export type UpdateTask = Partial<CreateTask>;

