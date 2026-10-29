import { QueryKey, useQueryClient } from "react-query";

export const useEditConfig = (queryKey: QueryKey) => {
  const queryClient = useQueryClient();

  return {
    onMutate: async (_target: any) => {
      await queryClient.cancelQueries(queryKey);
      const previous = queryClient.getQueriesData(queryKey);
      return { previous };
    },
    onError: (err: any, newItem: any, context: any) => {
      if (context?.previous) {
        context.previous.forEach(([key, data]: [QueryKey, unknown]) => {
          queryClient.setQueryData(key, data);
        });
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
      const previous = queryClient.getQueriesData(queryKey);
      queryClient.setQueriesData(queryKey, (old: any) => (old ? [...old, newItem] : [newItem]));
      return { previous };
    },
    onError: (err: any, newItem: any, context: any) => {
      if (context?.previous) {
        context.previous.forEach(([key, data]: [QueryKey, unknown]) => {
          queryClient.setQueryData(key, data);
        });
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
      const previous = queryClient.getQueriesData(queryKey);
      queryClient.setQueriesData(queryKey, (old: any[]) => old?.filter((item) => (item.id !== id)) || []);
      return { previous };
    },
    onError: (err: any, newItem: any, context: any) => {
      if (context?.previous) {
        context.previous.forEach(([key, data]: [QueryKey, unknown]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(queryKey);
    },
  };
};
