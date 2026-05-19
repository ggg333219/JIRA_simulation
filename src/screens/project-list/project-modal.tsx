import { Button, Drawer } from "antd";
import React from "react";
import { Project } from './list';

export const ProjectModal=(props:{projectModalOpen:boolean,onClose:()=>void; editingProject?:Project|null})=>{
    return <Drawer onClose={props.onClose}  open={props.projectModalOpen} width={'100%'}>
        <h1>{props.editingProject ? `编辑 ${props.editingProject.name}` : '创建项目'}</h1>
        <Button onClick={props.onClose}>close</Button>
    </Drawer>
}