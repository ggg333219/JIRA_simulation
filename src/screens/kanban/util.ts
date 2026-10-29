import { use, useCallback } from "react"
import { useLocation } from "react-router-dom"
import { useTask } from "../../utils/task"
import { useUrlQueryParam } from "../../utils/url"
import { useMemo } from "react"
import { useProject } from "utils/project"
export const useProjectIdInUrl=()=>{
    const{pathname}=useLocation()
    const id=pathname.match(/projects\/(\d+)/)?.[1]
    return Number(id)
}

export const useProjectInUrl=()=>useProject(useProjectIdInUrl())

export const useKanbanSearchParams = () => ({ projectId: useProjectIdInUrl() });

export const useKanbanQueryKey = () => ["kanbans", useKanbanSearchParams()];
export const useKanbansQueryKey = useKanbanQueryKey;

export interface TasksSearchParams {
    projectId: number;
    typeId?: number;
    processorId?: number;
    tagId?: number;
    name?: string;
}

export const useTasksSearchParams = (): TasksSearchParams => {
    const [param] = useUrlQueryParam([
        'name',
        'typeId',
        'processorId',
        'tagId',
    ]);
    const projectId = useProjectIdInUrl();
    return useMemo(
        () => ({
            projectId,
            typeId: Number(param.typeId) || undefined,
            processorId: Number(param.processorId) || undefined,
            tagId: Number(param.tagId) || undefined,
            name: param.name,
        }),
        [projectId, param]
    );
};

export const useTasksQueryKey = () => ["tasks", useTasksSearchParams()];

export const useTasksModal=()=>{
    const [{editingTaskId},setEditingTaskId]=useUrlQueryParam(['editingTaskId'])
    const {data:editingTask,isLoading}=useTask(Number(editingTaskId))
    const startEdit=useCallback((id:number)=>{
        console.log('[useTasksModal] startEdit set editingTaskId ->', id)
        setEditingTaskId({editingTaskId:id})
    },[setEditingTaskId])
    const close=useCallback(()=>{
        console.log('[useTasksModal] close editing modal')
        setEditingTaskId({editingTaskId:''})
    },[setEditingTaskId])
    return {
        editingTask,
        startEdit,close,isLoading,editingTaskId
    }
}