import React from "react";
import { useDocumentTitle } from "../../utils";
import { useKanbans, useReorderKanban } from "../../utils/kanban";
import { useKanbanQueryKey, useProjectInUrl, useTasksSearchParams } from "./util";
import { KanbanColumn } from "./kanban-column";
import styled from "@emotion/styled";
import { SearchPanel } from "./search-pannel";
import { ScreenContainer } from "components/lib";
import { useTasks } from "../../utils/task";
import { message, Spin } from "antd";
import CreateKanban from "./create-kanban";
import TaskModal from "./task-modal";
export const KanbanScreen =()=>{
    useDocumentTitle('看板列表')
    const {data:currentProject}=useProjectInUrl()
    const {data:kanbans=[],isLoading:kanbanIsLoading}=useKanbans({projectId: currentProject?.id})
    const {mutateAsync:reorderKanban,isLoading:reordering}=useReorderKanban(useKanbanQueryKey())
    const tasksSearchParams = useTasksSearchParams()
    const {data:tasks=[],isLoading:taskIsLoading}=useTasks(tasksSearchParams)
    const isLoading=taskIsLoading||kanbanIsLoading
    const onReorderColumn = async (fromId:number,referenceId:number) => {
        if (reordering || fromId === referenceId) return
        const fromIndex = kanbans.findIndex(({id}) => id === fromId)
        const referenceIndex = kanbans.findIndex(({id}) => id === referenceId)
        if (fromIndex < 0 || referenceIndex < 0) return
        try {
            await reorderKanban({
                fromId,
                referenceId,
                type: fromIndex < referenceIndex ? 'after' : 'before',
            })
        } catch (reason) {
            message.error(reason instanceof Error ? reason.message : '调整看板列顺序失败')
        }
    }
    return <ScreenContainer>
        <h1>{currentProject?.name ? `${currentProject.name}看板` : '看板'}</h1>
        <SearchPanel/>
        {isLoading?<Spin size="large"/>:<ColumnsContainer>
         {
            kanbans.map(kanban=><KanbanColumn kanban={kanban} tasks={tasks.filter(task=>task.kanbanId===kanban.id)} keyword={tasksSearchParams.name} onReorderColumn={onReorderColumn} key={kanban.id}/>
          
                )
        }
        <CreateKanban/>
        </ColumnsContainer>}
        <TaskModal/>
       
    </ScreenContainer>
}

 export const ColumnsContainer=styled.div`
    display:flex;
    overflow-x:auto;
    overflow-y:hidden;
    flex:1;
    min-height:0;
    width:100%;
`
