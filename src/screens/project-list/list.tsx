import { User } from "../../types/user.ts";
import { Dropdown, Table } from 'antd';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { Pin } from '../../components/pin.tsx';
import { ButtonNoPadding } from '../../components/lib.ts';
import { useDeleteProject, useEditProject } from '../../utils/project.ts';
import { useProjectModal } from './util.ts';
import {Modal} from 'antd';
import { Project } from '../../types/project.ts';

interface ListProps {
    list: Project[];
    users: User[];
    loading?: boolean;

    setProjectModalOpen?: (isOpen: boolean) => void;
    setEditingProject?: (p: Project | null) => void;
}

export const List = (props: ListProps) => {
    const { list, users, loading } = props;
    const { mutate } = useEditProject();

    const pinProject = (id: number) => (pin: boolean) => {
        return mutate({ id, pin });
    };

    const columns = [
        {
            title: <Pin checked={true} disabled={true} />,
            render(_: any, project: Project) {
                return <Pin checked={project.pin} onCheckedChange={pinProject(project.id)} />;
            },
        },
        {
            title: '名称',
            sorter: (a: Project, b: Project) => a.name.localeCompare(b.name),
            render(_: any, project: Project) {
                return <Link to={String(project.id)}>{project.name}</Link>;
            },
        },
        {
            title: '部门',
            dataIndex: 'organization',
        },
        {
            title: '负责人',
            render(_: any, project: Project) {
                return <span>{users.find((u: User) => String(u.id) === String(project.personId))?.name || '未知'}</span>;
            },
        },
        {
            title: '创建时间',
            render(_: any, project: Project) {
                return <span>{project.created ? dayjs(project.created).format('YYYY-MM-DD') : '无'}</span>;
            },
        },
        {
            render(_: any, project: Project) {
                return <More project={project}/>
            },
        },
    ];

    return <Table loading={loading} rowKey="id" pagination={false} columns={columns} dataSource={list} />;
};


const More=({project}:{project:Project})=>{
    const { startEdit } = useProjectModal();
    const { mutate: deleteProject } = useDeleteProject(['projects']);
    const confirmDeleteProject=(id:number)=>{
        Modal.confirm({
            title:'确定删除这个项目吗？',
            content:'点击确定删除',
            okText:'确定',
            onOk(){
                deleteProject({id})
            }
        })
    }
    const items = [
                    {
                        label: '编辑',
                        key: 'edit',
                    },
                    {
                        label: '删除',
                        key: 'delete',
                    },
                ];
    return  <Dropdown
                        menu={{
                            items,
                            onClick: ({ key }) => {
                                if (key === 'edit') {
                                    startEdit(project.id);
                                    return;
                                }

                                if (key === 'delete') {
                                    confirmDeleteProject(project.id);
                                }
                            },
                        }}
                    >
                        <ButtonNoPadding type="link">...</ButtonNoPadding>
                    </Dropdown>
}