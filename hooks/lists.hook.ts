import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ListWithTasks } from "@/types/database.types";
import {
  createList,
  getListsByBoard,
  updateList,
  deleteList,
} from "@/services/lists.service";
import { boardsKeys } from "@/types/key-query.types";

export const useLists = (boardID: string) => {

  return useQuery({
    queryKey: ["lists", boardID],
    queryFn: () => getListsByBoard(boardID),
    enabled: !!boardID,
  });
};

export const useCreateList = (boardID: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      data,
      userID,
    }: {
      data: {
        name: string;
        index: number;
        background?: string;
        isArchived?: boolean;
        boardID: string;
      };
      userID: string;
    }) => createList(data, userID),
    onMutate: async ({ data: newList }) => {
      await queryClient.cancelQueries({ queryKey: ["lists", boardID] });

      const previousLists = queryClient.getQueryData<ListWithTasks[]>([
        "lists",
        boardID,
      ]);

      const optimisticList: ListWithTasks = {
        $id: `temp-${Date.now()}`,
        name: newList.name,
        index: newList.index,
        background: newList.background || "",
        isArchived: newList.isArchived || false,
        boardID,
        $createdAt: new Date().toISOString(),
        $updatedAt: new Date().toISOString(),
        tasks: [],
      };

      queryClient.setQueryData<ListWithTasks[]>(["lists", boardID], (old) => [
        ...(old || []),
        optimisticList,
      ]);

      return { previousLists };
    },
    onError: (_err, _newList, context) => {
      if (context?.previousLists) {
        queryClient.setQueryData(["lists", boardID], context.previousLists);
      }
    },
    onSuccess: () => {
      // Invalidar tanto la query de listas como la del board completo
      queryClient.invalidateQueries({ queryKey: ["lists", boardID] });
      queryClient.invalidateQueries({ queryKey: boardsKeys.detail(boardID) });
    },
  });
};

export const useUpdateList = (boardID: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      listID,
      data,
    }: {
      listID: string;
      data: {
        name?: string;
        index?: number;
        background?: string;
        isArchived?: boolean;
      };
    }) => updateList(listID, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists", boardID] });
    },
  });
};

export const useDeleteList = (boardID: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (listID: string) => deleteList(listID),
    onMutate: async (listID) => {
      await queryClient.cancelQueries({ queryKey: ["lists", boardID] });

      const previousLists = queryClient.getQueryData<ListWithTasks[]>([
        "lists",
        boardID,
      ]);

      queryClient.setQueryData<ListWithTasks[]>(
        ["lists", boardID],
        (old) => old?.filter((list) => list.$id !== listID) || []
      );

      return { previousLists };
    },
    onError: (_err, _listID, context) => {
      if (context?.previousLists) {
        queryClient.setQueryData(["lists", boardID], context.previousLists);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["lists", boardID] });
    },
  });
};
