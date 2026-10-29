import { useState } from 'react';
import { Button, List, message, Modal, Spin } from 'antd';
import { Link, useParams } from 'react-router-dom';
import { ErrorBox, Row, ScreenContainer } from '../../components/lib';
import { useDeleteEpic, useEpics } from '../../utils/epic';
import { useProject } from '../../utils/project';
import { useTasks } from '../../utils/task';
import { CreateEpic } from './create-epic';

export const EpicScreen = () => {
    const { projectId: projectIdParam } = useParams<'projectId'>();
    const projectId = Number(projectIdParam);
    const [createOpen, setCreateOpen] = useState(false);
    const { data: project, error: projectError } = useProject(projectId);
    const { data: epics = [], isLoading, error } = useEpics(projectId);
    const { data: tasks = [], isLoading: tasksLoading, error: tasksError } = useTasks({ projectId });
    const { mutateAsync: deleteEpic, isLoading: deleting } = useDeleteEpic();

    const confirmDelete = (epicId: number, epicName: string, relatedTaskCount: number) => {
        if (relatedTaskCount > 0) {
            message.warning(`该任务组关联了 ${relatedTaskCount} 条任务，请先处理关联任务`);
            return;
        }

        Modal.confirm({
            title: `确定删除任务组“${epicName}”吗？`,
            content: '删除后无法恢复。',
            okText: '确定删除',
            okButtonProps: { danger: true },
            cancelText: '取消',
            onOk: () => deleteEpic({ id: epicId }).catch((reason: unknown) => {
                message.error(reason instanceof Error ? reason.message : '删除任务组失败');
                throw reason;
            }),
        });
    };

    return (
        <ScreenContainer>
            <Row between={true}>
                <h1>{project?.name ? `${project.name} · 任务组` : '任务组'}</h1>
                <Button type="link" onClick={() => setCreateOpen(true)} disabled={!projectId}>
                    创建任务组
                </Button>
            </Row>
            <ErrorBox error={projectError || error || tasksError} />
            {isLoading || tasksLoading ? <Spin size="large" /> : error || tasksError ? null : (
                <List dataSource={epics} renderItem={(epic) => {
                    const relatedTasks = tasks.filter(
                        (task) => task.projectId === projectId && task.epicId === epic.id,
                    );

                    return (
                        <List.Item
                            key={epic.id}
                            actions={[
                                <Button
                                    key="delete"
                                    type="link"
                                    danger
                                    loading={deleting}
                                    onClick={() => confirmDelete(epic.id, epic.name, relatedTasks.length)}
                                >
                                    删除
                                </Button>,
                            ]}
                        >
                            <div>
                                <h3>{epic.name}</h3>
                                {relatedTasks.length === 0 ? <span>暂无关联任务</span> : (
                                    <List
                                        size="small"
                                        dataSource={relatedTasks}
                                        renderItem={(task) => (
                                            <List.Item key={task.id}>
                                                <Link to={`/projects/${projectId}/kanban?editingTaskId=${task.id}`}>
                                                    {task.name}
                                                </Link>
                                            </List.Item>
                                        )}
                                    />
                                )}
                            </div>
                        </List.Item>
                    );
                }} />
            )}
            <CreateEpic
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                projectId={projectId}
                projectName={project?.name}
            />
        </ScreenContainer>
    );
};
