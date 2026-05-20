import { Button, Drawer } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { projectListActions } from "./project-list.slice";
import { selectProjectModalOpen } from "./project-list.slice";
export const ProjectModal=( )=>{
    const dispatch=useDispatch()
    const projectModalOpen=useSelector(selectProjectModalOpen)
    return <Drawer 
    onClose={()=>dispatch(projectListActions.closeProjectModal())}  
    open={projectModalOpen} 
    width={'100%'}>
        <h1>创建项目</h1>
        <Button onClick={()=>dispatch(projectListActions.closeProjectModal())}>close</Button>
    </Drawer>
}