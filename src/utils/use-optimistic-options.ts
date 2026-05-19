import { QueryKey, useQueryClient } from "react-query";

export const useEditConfig = (queryKey: QueryKey) => {
  const queryClient = useQueryClient();

  return {
    onMutate: async (target: any) => {
      await queryClient.cancelQueries(queryKey);
      const previous = queryClient.getQueryData(queryKey);
      return { previous };
    },
    onError: (err: any, newItem: any, context: any) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(queryKey);
    },
  };
};

export const useAddConfig = (queryKey: QueryKey) => {
  const queryClient = useQueryClient();

  return {
    onMutate: async (newItem: any) => {
      await queryClient.cancelQueries(queryKey);
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: any) => (old ? [...old, newItem] : [newItem]));
      return { previous };
    },
    onError: (err: any, newItem: any, context: any) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(queryKey);
    },
  };
};

export const useDeleteConfig = (queryKey: QueryKey) => {
  const queryClient = useQueryClient();

  return {
    onMutate: async ({ id }: { id: number }) => {
      await queryClient.cancelQueries(queryKey);
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: any[]) => old?.filter((item) => (item.id !== id)) || []);
      return { previous };
    },
    onError: (err: any, newItem: any, context: any) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(queryKey);
    },
  };
};
