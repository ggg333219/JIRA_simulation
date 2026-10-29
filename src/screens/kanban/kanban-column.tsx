import React, { useState } from "react";
import { Kanban } from "../../types/kanban";
import { Task } from "../../types/task";
import { useTaskTypes } from "../../utils/task-type";
import taskIcon from '../../assets/task.svg'
import bugIcon from '../../assets/bug.svg'
import styled from "@emotion/styled";
import Card from "antd/lib/card/Card";
import { useGetKanbanTasks, useReorderTask } from "../../utils/task";
import { useDeleteKanban } from "../../utils/kanban";
import { Button, Dropdown, message, Modal } from "antd";
import { CreateTask } from "./create-task";
import { useTasksModal } from "./util";
import { Mark } from "../../components/mark";

const TaskTypeIcon=({id}:{id:number})=>{
    const {data:taskTypes}=useTaskTypes()
    const name=taskTypes?.find(taskType=>taskType.id===id)?.name
    if(!name){
        return null
    }
    return <img alt={name} src={name==='task'?taskIcon:bugIcon}/>
}

export const KanbanColumn=({kanban,tasks,keyword,onReorderColumn}:{kanban:Kanban,tasks?:Task[],keyword?:string,onReorderColumn:(fromId:number,referenceId:number)=>void})=>{
    const reorderTask = useReorderTask()
    const getKanbanTasks = useGetKanbanTasks()
    const { mutateAsync: deleteKanban, isLoading: deleting } = useDeleteKanban()
    const [checkingDelete, setCheckingDelete] = useState(false)
    const {startEdit}=useTasksModal()
    const checkRelatedTasks = async () => {
        const relatedTasks = await getKanbanTasks(kanban.projectId, kanban.id)
        if (!Array.isArray(relatedTasks)) {
            throw new Error('无法核对看板列的关联任务')
        }
        return relatedTasks.length
    }
    const confirmDelete = async () => {
        if (!Number.isInteger(kanban.id) || kanban.id <= 0 || !Number.isInteger(kanban.projectId) || kanban.projectId <= 0) {
            message.error('看板列信息无效，无法删除')
            return
        }
        setCheckingDelete(true)
        try {
            const taskCount = await checkRelatedTasks()
            if (taskCount > 0) {
                message.warning(`该看板列还有 ${taskCount} 条任务，请先移动或删除任务`)
                return
            }
            Modal.confirm({
                title: `确定删除看板列“${kanban.name}”吗？`,
                content: '删除后无法恢复。',
                okText: '确定删除',
                okButtonProps: { danger: true },
                cancelText: '取消',
                onOk: async () => {
                    try {
                        const latestTaskCount = await checkRelatedTasks()
                        if (latestTaskCount > 0) {
                            message.warning(`该看板列还有 ${latestTaskCount} 条任务，请先移动或删除任务`)
                            throw new Error('看板列仍有关联任务')
                        }
                        await deleteKanban({ id: kanban.id })
                    } catch (reason) {
                        if (!(reason instanceof Error && reason.message === '看板列仍有关联任务')) {
                            message.error(reason instanceof Error ? reason.message : '删除看板列失败')
                        }
                        throw reason
                    }
                },
            })
        } catch (reason) {
            message.error(reason instanceof Error ? reason.message : '核对关联任务失败')
        } finally {
            setCheckingDelete(false)
        }
    }
    const onDrop = (e: React.DragEvent) => {
        e.preventDefault()
        if (e.dataTransfer.types.includes('application/x-jira-kanban-id')) {
            const fromId = Number(e.dataTransfer.getData('application/x-jira-kanban-id'))
            if (Number.isInteger(fromId) && fromId > 0) onReorderColumn(fromId, kanban.id)
            return
        }
        const taskId = e.dataTransfer.getData('text/plain')
        if(!taskId) return
        const id = Number(taskId)
        if(!id) return
        reorderTask.mutate({ id, kanbanId: kanban.id })
    }

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }

    return <Container onDrop={onDrop} onDragOver={onDragOver}>
        <ColumnHeader>
            <span
                draggable
                title="拖动调整看板列顺序"
                aria-label={`拖动看板列${kanban.name}`}
                onDragStart={e => {
                    e.dataTransfer.effectAllowed = 'move'
                    e.dataTransfer.setData('application/x-jira-kanban-id', String(kanban.id))
                }}
                style={{cursor: 'grab'}}
            >⠿</span>
            <h3>{kanban.name}</h3>
            <Dropdown menu={{ items: [{ key: 'delete', label: '删除看板列', danger: true }], onClick: () => { void confirmDelete() } }}>
                <Button type="text" loading={checkingDelete || deleting} aria-label={`操作看板列${kanban.name}`}>...</Button>
            </Dropdown>
        </ColumnHeader>
        <TasksContainer>
             {tasks?.map(task=>
        <Card onClick={()=>{console.log('[kanban-column] card click, startEdit', task.id); startEdit(task.id)}} draggable style={{marginBottom:'0.5rem'}} key={task.id} onDragStart={e=>e.dataTransfer.setData('text/plain',String(task.id))}>
            <div>
                <Mark name={task.name} keyword={keyword}/>
            </div>
            
            <TaskTypeIcon id={task.typeId}/>
        </Card>)}
        <CreateTask kanbanId={kanban.id}/>
        </TasksContainer>
       
    </Container>
}

const ColumnHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    h3 { margin-bottom: 0; }
`

export const Container=styled.div`
    min-width:27rem;
    border-radius:6px;
    background-color:rgb(244,245,247);
    flex-direction:column;
    padding:0.7rem 0.7rem 1rem;
    margin-right:1.5rem;
    display:flex;
    height:100%;
    overflow:hidden;
`

const TasksContainer=styled.div`
    overflow:scroll;
    flex:1;
    ::-webkit-scrollbar{
        display:none;
    }
`
