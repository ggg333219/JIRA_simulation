import { Button, Drawer } from "antd";
import React, { useEffect } from "react";
import { Project } from '../../types/project.ts';
import { useProjectModal } from "./util";
import { Spin ,Form,Input} from "antd";
import { UserSelect } from "../../components/user-select";
import { useAddProject, useEditProject } from "../../utils/project";
import { useForm } from "antd/lib/form/Form";
import { ErrorBox } from "../../components/lib";
import styled from "@emotion/styled";

export const ProjectModal=()=>{
    const {projectModalOpen,close,editProject,isLoading}=useProjectModal()
    const title = editProject ? '编辑项目' : '创建项目'
    const addProject = useAddProject()
    const editProjectMut = useEditProject()
    const { mutateAsync, error, isLoading: mutateLoading } = editProject ? editProjectMut : addProject
    const [form]=useForm()
    const onFinish=async (values:any)=>{
        try {
            await mutateAsync({ ...(editProject || {}), ...values });
            form.resetFields()
            close()
        } catch (e) {
            // 错误会由 ErrorBox 显示（来自上面的 `error`）
        }
    }

    useEffect(()=>{
        form.setFieldsValue(editProject || {})
    },[editProject,form])

   return <Drawer onClose={close}  open={projectModalOpen} width={'100%'}>
       {
        isLoading?<Spin size="large"/>:<>
            <h1>{title}</h1>
            <ErrorBox error={error}/>
            <Form form={form} layout="vertical" style={{width:'40rem'}} onFinish={onFinish}>
                <Form.Item label="名称" name={'name'} rules={[{required:true,message:'请输入项目名'}]}>
                    <Input placeholder={"请输入项目名称"}/>
                </Form.Item>
                <Form.Item label="部门" name="organization" rules={[{required:true,message:'请输入部门名'}]}>
                    <Input placeholder={"请输入部门名称"}/>
                </Form.Item>
                <Form.Item label="负责人" name="personId" rules={[{required:true,message:'请输入负责人'}]}>
                    <UserSelect defaultOptionName="负责人"   />
                </Form.Item>
                <Form.Item style={{textAlign:"right"}}>
                    <Button loading={mutateLoading} type="primary" htmlType="submit" >
                        提交
                    </Button>
                </Form.Item>
            </Form>
        </>
       }
    </Drawer>
}

const Container=styled.div`
    height:80vh;
    flex-direction:column;
    display:flex;
    justify-content:center;
    align-items:center
`