import React, { useEffect } from 'react';
import { useProjectIdInUrl, useTasksModal } from './util';
import { useDeleteTask, useEditTask } from 'utils/task';
import { Button, Form, Input, Modal, message } from 'antd';
import { UserSelect } from 'components/user-select';
import { TaskTypeSelect } from 'components/task-type-select';

const layout={
    labelCol:{span:8},
    wrapperCol:{span:16}
}
export const TaskModal= () => {
    const [form] = Form.useForm()
    const {editingTask,editingTaskId,isLoading,close}=useTasksModal()
    const projectId = useProjectIdInUrl()
    const {mutateAsync:editTask,isLoading:editLoading}=useEditTask()
    const {mutateAsync:deleteTask,isLoading:deleteLoading}=useDeleteTask()
    const onCancel=()=>{
        close()
        form.resetFields()
    }

    const onOk=async()=>{
        if(!editingTaskId || isNaN(Number(editingTaskId))){
            message.error('任务 id 无效，无法提交修改')
            return
        }
        try{
            const values = await form.validateFields()
            const payload = { id: Number(editingTaskId), ...editingTask, ...values }
            console.log('[task-modal] submit payload:', payload)
            const result = await editTask(payload)
            console.log('[task-modal] edit result:', result)
            close()
        }catch(err:any){
            console.error('[task-modal] edit error:', err)
            message.error(err?.message || '更新任务失败')
        }
    }
    const confirmDelete = () => {
        const id = Number(editingTaskId)
        if (!Number.isInteger(id) || id <= 0 || editingTask?.id !== id || editingTask.projectId !== projectId) {
            message.error('任务信息无效，无法删除')
            return
        }

        Modal.confirm({
            title: `确定删除任务“${editingTask.name}”吗？`,
            content: '删除后无法恢复。',
            okText: '确定删除',
            okButtonProps: { danger: true },
            cancelText: '取消',
            onOk: () => deleteTask({ id }).then(() => {
                close()
                form.resetFields()
            }).catch((reason: unknown) => {
                message.error(reason instanceof Error ? reason.message : '删除任务失败')
                throw reason
            }),
        })
    }
    useEffect(()=>{
        console.log('[task-modal] editingTaskId=', editingTaskId, 'editingTask=', editingTask)
        form.setFieldsValue(editingTask || {})
    },[form,editingTask])
    return <Modal onCancel={onCancel} onOk={onOk}  okText={'确认'} cancelText={'取消'} confirmLoading={editLoading || isLoading} title={'编辑任务'} open={!!editingTaskId}>
        <Form {...layout} initialValues={editingTask} form={form}>
        <Form.Item label={'任务名'}
        name={'name'} rules={[{required:true,message:'请输入任务名'}]}
        >
            <Input/>
        </Form.Item>

        <Form.Item label={'经办人'}
        name={'processorId'}
        >
            <UserSelect defaultOptionName='经办人'/>
        </Form.Item>

        <Form.Item label={'类型'}
        name={'typeId'} 
        >
            <TaskTypeSelect/>
        </Form.Item>
        </Form>
        <div style={{ textAlign: 'right' }}>
            <Button danger onClick={confirmDelete} loading={deleteLoading} disabled={isLoading || !editingTask}>
                删除任务
            </Button>
        </div>
    </Modal>
}

export default TaskModal;
