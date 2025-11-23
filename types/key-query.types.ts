export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
};

export const boardsKeys = {
  all: ["boards"] as const,
  lists: () => [...boardsKeys.all, "list"] as const,
  details: () => [...boardsKeys.all, "detail"] as const,
  detail: (boardID: string) => [...boardsKeys.details(), boardID] as const,
};