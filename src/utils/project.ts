import { useHttp } from "./http";
import { QueryKey, useMutation, useQuery } from "react-query";
import {
  useDeleteConfig,
  useEditConfig,
} from "./use-optimistic-options";
import { Project } from "../types/project";
import { cleanObject } from "./index";
import { useQueryClient } from "react-query";
export const useProjects = (param?: Partial<Project>) => {
  const client = useHttp();
  const cleanedParam = cleanObject({
    ...param,
    ...(param?.name ? { name_like: param.name } : {}),
  });

  if ('name' in cleanedParam) {
    delete (cleanedParam as { name?: unknown }).name;
  }

  return useQuery<Project[],Error>(['projects',cleanedParam],()=>client(['projects',{data:cleanedParam}]))
};

export const  useEditProject = (queryKey: QueryKey = ["projects"]) => {
  const client = useHttp();
  const config = useEditConfig(queryKey);

  return useMutation((params: Partial<Project>) =>
    client([`projects/${params.id}`, { method: 'PATCH', data: params }]),
    config,
  );
};

export const useAddProject = () => {
  const client = useHttp();
  const queryClient=useQueryClient()
  
  return useMutation((params:Partial<Project>)=>
    client(['projects', { data: params, method: 'POST' }]),{
    onSuccess:()=>queryClient.invalidateQueries('projects')
  }
  )

 
};

export const useDeleteProject = (queryKey: QueryKey) => {
  const client = useHttp();

  return useMutation(
    ({ id }: { id: number }) =>
      client([`projects/${id}`, {
        method: "DELETE",
      }]),
    useDeleteConfig(queryKey)
  );
};

export const useProject = (id?: number) => {
  const client = useHttp();
  return useQuery<Project>(
    ['project',{id}],
    ()=>client([`projects/${id}`, {}]),
    {
      enabled:!!id
    }
  )
};

