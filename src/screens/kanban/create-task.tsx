import React, { useEffect, useState } from 'react';
import { useTasksQueryKey, useProjectIdInUrl } from './util';
import Input from 'antd/lib/input/Input';
import { useAddTask } from 'utils/task';
import { Card } from 'antd';
import { useTaskTypes } from '../../utils/task-type';
export const CreateTask= ({kanbanId}:{kanbanId:number}) =>{
    const [name,setName]=useState('')
    const projectId=useProjectIdInUrl()
    const {mutateAsync:addTask}=useAddTask(useTasksQueryKey())
    const [inputMode,setInputMode]=useState(false)
    const { data: taskTypes = [] } = useTaskTypes()
    const defaultTypeId = taskTypes.find(taskType => taskType.name === 'task')?.id ?? taskTypes[0]?.id

    const submit=async()=>{
        await addTask({name,projectId,kanbanId,typeId:defaultTypeId})
        setInputMode(false)
        setName('')
    }

    const toggle=()=>setInputMode(mode=>!mode)

    useEffect(()=>{
        if(!inputMode){
            setName('')
        }
    },[inputMode])

    if(!inputMode){
        return <div onClick={toggle}>+创建事务</div>
    }
    return <Card>
        
        <Input  onBlur={toggle} 
                placeholder='需要做些什么？' 
                autoFocus={true}
                onPressEnter={submit} value={name} 
                onChange={evt=>setName(evt.target.value)}/>
    
    </Card>
};


