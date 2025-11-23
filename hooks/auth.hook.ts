import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { login, register, logout, getCurrentUser } from '@/services/auth.service';
import { User } from '@/types/auth.types';
import { useRouter } from 'next/navigation';
import { authKeys } from '@/types/key-query.types';
import { boardsKeys } from '@/types/key-query.types';

export const useAuth = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: user, isLoading, refetch } = useQuery<User | null>({
        queryKey: authKeys.user(),
        queryFn: () => getCurrentUser(),
        staleTime: 30 * 60 * 1000,
    });

    const createUserMutation = useMutation({
        mutationFn: ({ email, password, name }: { email: string; password: string; name: string }) =>
            register(email, password, name),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: authKeys.user() });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: authKeys.user() });
            refetch();
        },
    });

    const loginMutation = useMutation({
        mutationFn: ({ email, password }: { email: string; password: string }) =>
            login(email, password),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: authKeys.user() });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: authKeys.user() });
            queryClient.invalidateQueries({ queryKey: boardsKeys.lists() });
        },
    });

    const logoutMutation = useMutation({
        mutationFn: () => logout(),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: authKeys.user() });
        },
        onSuccess: () => {
            queryClient.setQueryData(authKeys.user(), null);
            queryClient.setQueryData(boardsKeys.lists(), null);
            router.refresh()
        },
    });

    return {
        user,
        isLoading,
        refetch,
        createUserMutation,
        loginMutation,
        logoutMutation,
    };
}