import { Task } from "../types/task";
import { useHttp } from "./http";
import { QueryKey, useMutation, useQuery, useQueryClient } from "react-query";
import { cleanObject } from "./index";
import type { TasksSearchParams } from "../screens/kanban/util";

export const useTasks = (param?: Partial<TasksSearchParams>) => {
  const client = useHttp();
  const cleanedParam = cleanObject({
    ...param,
    ...(param?.name ? { name_like: param.name } : {}),
  });

  if ('name' in cleanedParam) {
    delete (cleanedParam as { name?: unknown }).name;
  }

  return useQuery<Task[],Error>(['tasks',cleanedParam],()=>client(['tasks',{data:cleanedParam}]), {
    enabled: !!cleanedParam.projectId,
  });
};

export const useGetKanbanTasks = () => {
  const client = useHttp();
  return (projectId: number, kanbanId: number): Promise<Task[]> =>
    client(['tasks', { data: { projectId, kanbanId } }]);
};

export const useReorderTask = (queryKey: QueryKey = ['tasks']) => {
  const client = useHttp();
  const queryClient = useQueryClient();

  return useMutation(
    (params: { id: number } & Partial<Task>) =>
      client([`tasks/${params.id}`, { method: 'PATCH', data: params }]),
    {
      onSuccess: () => queryClient.invalidateQueries(queryKey),
    }
  );
};
export const useAddTask = (querykey:QueryKey) => {
  const client = useHttp();
  const queryClient=useQueryClient()
  
  return useMutation((params:Partial<Task>)=>
    client(['tasks', { data: params, method: 'POST' }]),{
    onSuccess:()=>queryClient.invalidateQueries('tasks')
  }
  )

 
};

export const useTask = (id?: number) => {
  const client = useHttp();
  return useQuery<Task>(
    ['task',{id}],
    ()=>client([`tasks/${id}`, {}]),
    {
      enabled:!!id
    }
  )
};

export const useEditTask = () => {
  const client = useHttp();
  const queryClient = useQueryClient();

  return useMutation<Task, Error, Partial<Task>>(
    (params) => client([`tasks/${params.id}`, { method: 'PATCH', data: params }]),
    {
      onSuccess: (updatedTask) => {
        queryClient.setQueriesData<Task[]>(['tasks'], (tasks) =>
          tasks?.map((task) => task.id === updatedTask.id ? updatedTask : task),
        );
        queryClient.setQueryData(['task', { id: updatedTask.id }], updatedTask);
        queryClient.invalidateQueries(['tasks']);
      },
    },
  );
};

export const useDeleteTask = () => {
  const client = useHttp();
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, { id: number }>(
    ({ id }) => client([`tasks/${id}`, { method: 'DELETE' }]),
    {
      onSuccess: (_, { id }) => {
        queryClient.invalidateQueries(['tasks']);
        queryClient.removeQueries(['task', { id }], { exact: true });
      },
    },
  );
};
