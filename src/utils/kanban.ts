import { Kanban } from "../types/kanban";
import { useHttp } from "./http";
import { QueryKey, useMutation, useQuery } from "react-query";
import { cleanObject } from "./index";
import { Project } from "../types/project";
import { useQueryClient } from "react-query";

export const useKanbans = (param?: Partial<Kanban>) => {
  const client = useHttp();
  const cleanedParam = cleanObject({
    ...param,
    ...(param?.name ? { name_like: param.name } : {}),
  });

  if ('name' in cleanedParam) {
    delete (cleanedParam as { name?: unknown }).name;
  }

  return useQuery<Kanban[],Error>(
    ['kanbans',cleanedParam],
    ()=>client(['kanbans',{data:cleanedParam}]),
    {
      enabled: !!cleanedParam.projectId,
    }
  )
};

export interface KanbanSortProps {
  fromId: number;
  referenceId: number;
  type: 'before' | 'after';
}

export const useReorderKanban = (queryKey: QueryKey = ['kanbans']) => {
  const client = useHttp();
  const queryClient = useQueryClient();

  return useMutation<Kanban[], Error, KanbanSortProps, { previous?: Kanban[] }>(
    (params) => client(['kanbans/reorder', { method: 'POST', data: params }]),
    {
      onMutate: async ({ fromId, referenceId, type }) => {
        await queryClient.cancelQueries(queryKey);
        const previous = queryClient.getQueryData<Kanban[]>(queryKey);
        if (previous) {
          const moving = previous.find(({ id }) => id === fromId);
          const reordered = previous.filter(({ id }) => id !== fromId);
          const referenceIndex = reordered.findIndex(({ id }) => id === referenceId);
          if (moving && referenceIndex !== -1) {
            reordered.splice(referenceIndex + (type === 'after' ? 1 : 0), 0, moving);
            queryClient.setQueryData(queryKey, reordered);
          }
        }
        return { previous };
      },
      onError: (_error, _params, context) => {
        if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
      },
      onSettled: () => queryClient.invalidateQueries(queryKey),
    },
  );
};

export const useAddKanban = (querykey:QueryKey) => {
  const client = useHttp();
  const queryClient=useQueryClient()
  
  return useMutation((params:Partial<Kanban>)=>
    client(['kanbans', { data: params, method: 'POST' }]),{
    onSuccess:()=>queryClient.invalidateQueries('kanbans')
  }
  )

 
};

export const useDeleteKanban = () => {
  const client = useHttp();
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, { id: number }>(
    ({ id }) => client([`kanbans/${id}`, { method: 'DELETE' }]),
    { onSuccess: () => queryClient.invalidateQueries(['kanbans']) },
  );
};
