import React from "react";
import { useTasksSearchParams } from "./util";
import { useSetUrlQueryParam } from "../../utils/url";
import { Row,Input, Button } from "antd";
import { UserSelect } from "../../components/user-select";
import { TaskTypeSelect } from "../../components/task-type-select";
export const SearchPanel=()=>{
    const searchParams=useTasksSearchParams()
    const setSearchParams=useSetUrlQueryParam()
    const reset=()=>{
        setSearchParams({
            typeId:undefined,
            processorId:undefined,
            tagId:undefined,
            name:undefined
        })
    }
    return <Row style={{ 
    marginBottom: 16, 
    display: 'flex', 
    gap: '20px',
    flexWrap: 'wrap'
  }} >
        <Input style={{width:'20rem'}} placeholder={'任务名'} value={searchParams.name}
                onChange={evt=>setSearchParams({name:evt.target.value})}/>
        <UserSelect defaultOptionName={'经办人'} 
                    value={searchParams.processorId}
                    onChange={value=>setSearchParams({processorId:value})}/>
        <TaskTypeSelect defaultOptionName={'类型'} 
                    value={searchParams.typeId}
                    onChange={value=>setSearchParams({typeId:value})}/>
        <Button onClick={reset}>清除筛选器</Button>
    </Row>
}