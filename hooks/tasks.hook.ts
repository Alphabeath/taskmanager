import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Task } from "@/types/database.types";
import {
  createTask,
  getTasksByList,
  updateTask,
  deleteTask,
} from "@/services/tasks.service";

export const useTasks = (listID: string) => {
  return useQuery({
    queryKey: ["tasks", listID],
    queryFn: () => getTasksByList(listID),
    enabled: !!listID,
  });
};

export const useCreateTask = (listID: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      title: string;
      description?: string;
      index: number;
      isCompleted?: boolean;
      priority?: number;
    }) => createTask({ ...data, listID }, "current"),
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", listID] });

      const previousTasks = queryClient.getQueryData<Task[]>(["tasks", listID]);

      const optimisticTask: Task = {
        $id: `temp-${Date.now()}`,
        title: newTask.title,
        description: newTask.description || "",
        listID,
        index: newTask.index,
        isCompleted: newTask.isCompleted || false,
        priority: newTask.priority || 0,
        $createdAt: new Date().toISOString(),
        $updatedAt: new Date().toISOString(),
      };
      queryClient.setQueryData<Task[]>(["tasks", listID], (old) => [
        ...(old || []),
        optimisticTask,
      ]);
      return { previousTasks };
    },
    onError: (_err, _newTask, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks", listID], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", listID] });
    },
  });
};

export const useUpdateTask = (listID: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      taskID: string;
      title?: string;
      description?: string;
      isCompleted?: boolean;
      priority?: number;
    }) =>
      updateTask(data.taskID, {
        title: data.title,
        description: data.description,
        isCompleted: data.isCompleted,
        priority: data.priority,
      }),
    onMutate: async (updatedTask) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", listID] });
      const previousTasks = queryClient.getQueryData<Task[]>(["tasks", listID]);

      queryClient.setQueryData<Task[]>(["tasks", listID], (old) =>
        old
          ? old.map((task) =>
              task.$id === updatedTask.taskID
                ? { ...task, ...updatedTask }
                : task
            )
          : []
      );

      return { previousTasks };
    },
    onError: (_err, _updatedTask, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks", listID], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", listID] });
    },
  });
};

export const useDeleteTask = (listID: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskID: string) => deleteTask(taskID),
    onMutate: async (deletedTaskID) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", listID] });

      const previousTasks = queryClient.getQueryData<Task[]>(["tasks", listID]);

      queryClient.setQueryData<Task[]>(["tasks", listID], (old) =>
        old ? old.filter((task) => task.$id !== deletedTaskID) : []
      );

      return { previousTasks };
    },
    onError: (_err, _deletedTaskID, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks", listID], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", listID] });
    },
  });
};
