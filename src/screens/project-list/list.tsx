import { User } from "./search-pannel.tsx";
import { Dropdown, Table } from "antd";
import dayjs from 'dayjs';
import {Link} from "react-router-dom";
import { Pin } from "../../components/pin.tsx";
import { useEditProject } from "../../utils/project.ts";
import { ButtonNoPadding } from "../../components/lib.ts";

 interface ListProps{
    list:Project[];
    users:User[];
    loading?: boolean;
    refresh?:()=>void;
    setProjectModalOpen?:(isOpen:boolean)=>void;
    setEditingProject?:(p:Project|null)=>void;
}
export interface Project{
    id: number;
    name: string;
    personId: number;
    pin: boolean;
    organization: string;
    created:number;
}
export const List = (props: ListProps) => {
    const { list, users, loading, refresh } = props;
    const { mutate } = useEditProject();

    const pinProject = (id: number) => (pin: boolean) => {
        return mutate({ id, pin }).then(() => {
            if (typeof refresh === 'function') refresh();
        });
    };

    const columns = [
        {
            title: <Pin checked={true} disabled={true} />,
            render(_: any, project: Project) {
                return (
                    <Pin
                        checked={project.pin}
                        onCheckedChange={pinProject(project.id)}
                    />
                );
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
                return (
                    <span>
                        {users.find((u: User) => String(u.id) === String(project.personId))?.name || '未知'}
                    </span>
                );
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
                const items = [
                    {
                        label: '编辑',
                        key: 'edit',
                        onClick: () => {
                            props.setEditingProject?.(project);
                            props.setProjectModalOpen?.(true);
                        },
                    },
                ];

                return (
                    <Dropdown menu={{ items }}>
                        <ButtonNoPadding type="link">...</ButtonNoPadding>
                    </Dropdown>
                );
            },
        },
    ];

    return <Table loading={loading} rowKey="id" pagination={false} columns={columns} dataSource={list} />;
};