import { useHttp } from "./http";
import { QueryKey, useMutation, useQuery } from "react-query";
import {
  useAddConfig,
  useDeleteConfig,
  useEditConfig,
} from "./use-optimistic-options";
import { Project } from "../types/project";
import { cleanObject } from "./index";
import { useAsync } from "./use-async";
import { useCallback, useEffect } from "react";

export const useProjects = (param?: Partial<Project>) => {
  const client = useHttp();
  const { run, retry, ...result } = useAsync<Project[]>();
  const fetchProjects = useCallback(
    () => client(["projects", { data: cleanObject(param || {}) }]),
    [client, param],
  );

  useEffect(() => {
    run(fetchProjects(), { retry: fetchProjects });
  }, [fetchProjects, run]);

  return { run, retry, ...result };
};

export const useEditProject = (queryKey: QueryKey = ["projects"]) => {
  const client = useHttp();

  const mutation = useMutation(
    (params: Partial<Project>) =>
      client([`projects/${params.id}`, { data: params, method: 'PATCH' }]),
    useEditConfig(queryKey),
  );

  return {
    ...mutation,
    mutate: mutation.mutateAsync,
  } as const;
};

export const useAddProject = () => {
  const client = useHttp();
  const {run,...asyncresult}=useAsync()
  const mutate=(params:Partial<Project>)=>{
    run(client([`projects/${params.id}`, {
        data:params,
        method:'POST'
    }]))
  }
    return{
        mutate,
        ...asyncresult
    }
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
  const { run, ...result } = useAsync<Project>();

  useEffect(() => {
    if (id) {
      run(client([`projects/${id}`, {}]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return result;
};

