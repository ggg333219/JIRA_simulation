import { useUrlQueryParam } from "../../utils/url";
import { useMemo } from "react";
import { useProject } from "../../utils/project";

type ProjectSearchParams = {
    name?: string;
    personId?: number;
};

export const useProjectsSearchParams = () => {
    const [param, setParam] = useUrlQueryParam(["name", "personId"]);
    return [
        useMemo(() => ({
            ...param,
            personId: param.personId ? Number(param.personId) : undefined,
        }) as Partial<ProjectSearchParams>, [param]),
        setParam,
    ] as const;
};

export const useProjectModal=()=>{
    const [{projectCreate, editingProjectId}, setProjectModalParams] = useUrlQueryParam([
        'projectCreate',
        'editingProjectId',
    ])

    const {data:editProject,isLoading}=useProject(Number(editingProjectId))
    const open=()=>setProjectModalParams({projectCreate:true})
    const close=()=>{
        setProjectModalParams({
            projectCreate: undefined,
            editingProjectId: undefined,
        })
    }
    const startEdit=(id:number)=>setProjectModalParams({editingProjectId:id})
    return{
        projectModalOpen:projectCreate==='true'||Boolean(editingProjectId),
        open,
        close,
        startEdit,
        editProject,
        isLoading
    }
        
}

export const useProjectQueryKey=()=>['projects',useProjectsSearchParams()]