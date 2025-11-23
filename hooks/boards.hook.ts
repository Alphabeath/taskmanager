import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBoard,
  updateBoard,
  getBoardsByUser,
  getBoardComplete,
  deleteBoard,
} from "@/lib/services/boards.service";
import { Board, CreateBoard, UpdateBoard } from "@/types/database.types";

export const boardsKeys = {
  all: ["boards"] as const,
  lists: () => [...boardsKeys.all, "list"] as const,
  list: (userID: string) => [...boardsKeys.lists(), userID] as const,
  details: () => [...boardsKeys.all, "detail"] as const,
  detail: (boardID: string) => [...boardsKeys.details(), boardID] as const,
};


export const useBoards = (userID: string) => {
  const queryClient = useQueryClient();

  const {
    data: boards,
    isLoading,
    error,
  } = useQuery({
    queryKey: boardsKeys.list(userID),
    queryFn: () => getBoardsByUser(userID),
    enabled: !!userID,
    staleTime: 5 * 60 * 1000,
  });

  const createBoardMutation = useMutation({
    mutationFn: (data: CreateBoard) => createBoard(data, userID),
    onMutate: async (newBoard) => {
      await queryClient.cancelQueries({ queryKey: boardsKeys.list(userID) });

      const previousBoards = queryClient.getQueryData<Board[]>(
        boardsKeys.list(userID)
      );

      queryClient.setQueryData<Board[]>(boardsKeys.list(userID), (old) => [
        ...(old || []),
        {
          ...newBoard,
          $id: `temp-${Date.now()}`,
          $createdAt: new Date().toISOString(),
          $updatedAt: new Date().toISOString(),
        } as Board,
      ]);

      return { previousBoards };
    },
    onError: (err, newBoard, context) => {
      if (context?.previousBoards) {
        queryClient.setQueryData(
          boardsKeys.list(userID),
          context.previousBoards
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardsKeys.list(userID) });
    },
  });

  const updateBoardMutation = useMutation({
    mutationFn: ({ boardID, data }: { boardID: string; data: UpdateBoard }) =>
      updateBoard(boardID, data),
    onMutate: async ({ boardID, data }) => {
      await queryClient.cancelQueries({ queryKey: boardsKeys.list(userID) });
      await queryClient.cancelQueries({ queryKey: boardsKeys.detail(boardID) });

      const previousBoards = queryClient.getQueryData<Board[]>(
        boardsKeys.list(userID)
      );
      const previousBoard = queryClient.getQueryData<Board>(
        boardsKeys.detail(boardID)
      );

      queryClient.setQueryData<Board[]>(boardsKeys.list(userID), (old) => {
        if (!old) return old;
        return old.map((board) =>
          board.$id === boardID
            ? { ...board, ...data, $updatedAt: new Date().toISOString() }
            : board
        );
      });

      queryClient.setQueryData<Board>(boardsKeys.detail(boardID), (old) => {
        if (!old) return old;
        return { ...old, ...data, $updatedAt: new Date().toISOString() };
      });

      return { previousBoards, previousBoard };
    },
    onError: (err, { boardID }, context) => {
      if (context?.previousBoards) {
        queryClient.setQueryData(
          boardsKeys.list(userID),
          context.previousBoards
        );
      }
      if (context?.previousBoard) {
        queryClient.setQueryData(
          boardsKeys.detail(boardID),
          context.previousBoard
        );
      }
    },
    onSuccess: (_, { boardID }) => {
      queryClient.invalidateQueries({ queryKey: boardsKeys.list(userID) });
      queryClient.invalidateQueries({ queryKey: boardsKeys.detail(boardID) });
    },
  });

  const deleteBoardMutation = useMutation({
    mutationFn: (boardID: string) => deleteBoard(boardID),
    onMutate: async (boardID) => {
      await queryClient.cancelQueries({ queryKey: boardsKeys.list(userID) });

      const previousBoards = queryClient.getQueryData<Board[]>(
        boardsKeys.list(userID)
      );

      queryClient.setQueryData<Board[]>(
        boardsKeys.list(userID),
        (old) => old?.filter((board) => board.$id !== boardID) || []
      );

      queryClient.removeQueries({ queryKey: boardsKeys.detail(boardID) });

      return { previousBoards };
    },
    onError: (err, boardID, context) => {
      if (context?.previousBoards) {
        queryClient.setQueryData(
          boardsKeys.list(userID),
          context.previousBoards
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardsKeys.list(userID) });
    },
  });

  return {
    boards,
    isLoading,
    error,
    createBoard: createBoardMutation.mutate,
    createBoardAsync: createBoardMutation.mutateAsync,
    updateBoard: updateBoardMutation.mutate,
    updateBoardAsync: updateBoardMutation.mutateAsync,
    deleteBoard: deleteBoardMutation.mutate,
    deleteBoardAsync: deleteBoardMutation.mutateAsync,
    isCreating: createBoardMutation.isPending,
    isUpdating: updateBoardMutation.isPending,
    isDeleting: deleteBoardMutation.isPending,
  };
};

export const useBoard = (boardID: string) => {
  const {
    data: board,
    isLoading,
    error,
  } = useQuery({
    queryKey: boardsKeys.detail(boardID),
    queryFn: () => getBoardComplete(boardID),
    enabled: !!boardID,
    staleTime: 5 * 60 * 1000,
  });

  return {
    board,
    isLoading,
    error,
  };
};
