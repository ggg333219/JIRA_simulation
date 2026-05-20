import { useMemo, useState } from 'react';
import { List } from './list.tsx';
import { SearchPannel } from './search-pannel.tsx';
import { useDebounce, useDocumentTitle, useMount, cleanObject } from '../../utils/index.tsx';
import { useHttp } from '../../utils/http.ts';
import styled from '@emotion/styled';
import { Button, Spin } from 'antd';
import { ButtonNoPadding, FullPageError, Row } from '../../components/lib';
import { useProjectsSearchParams } from './util.ts';
import { useProjects } from '../../utils/project.ts';
import { useDispatch } from 'react-redux';
import { projectListActions } from './project-list.slice.tsx';

export const ProjectListScreen = () => {
    const [param, setParam] = useProjectsSearchParams();
    const debounceParam = useDebounce(param, 200);
    const [users, setUsers] = useState<any[]>([]);
    const [usersError, setUsersError] = useState<Error | null>(null);
    const { isLoading, error, data: list, retry, run } = useProjects(debounceParam);
    const projectError = error instanceof Error ? error : error ? new Error(String(error)) : null;
    const safeList = Array.isArray(list) ? list : [];
    const client = useHttp();
    useDocumentTitle('项目列表',false)
    const dispatch=useDispatch()
    const filteredList = useMemo(() => {
        return safeList.filter((project) => {
            const nameMatch = debounceParam.name
                ? project.name.toLowerCase().includes(debounceParam.name.toLowerCase())
                : true;
            const personMatch = debounceParam.personId
                ? String(project.personId) === String(debounceParam.personId)
                : true;
            return nameMatch && personMatch;
        });
    }, [safeList, debounceParam]);

    useMount(() => {
        client(['users', {}])
            .then((data) => {
                setUsers(
                    data.map((user: any) => ({
                        ...user,
                        id: String(user.id),
                    })),
                );
            })
            .catch((err) => {
                setUsersError(err instanceof Error ? err : new Error(String(err)));
            });
    });

    return (
        <Container>
            <Row between={true}>
                {usersError ? (
                <FullPageError error={usersError} />
            ) : projectError ? (
                <FullPageError error={projectError} />
            ) : null}
            <h1>项目列表</h1>
            <ButtonNoPadding
            onClick={()=>dispatch(projectListActions.openProjectModal())}
            type='link'
            >创建项目</ButtonNoPadding>
            </Row>
            
            <Button
                onClick={() => {
                    const q = cleanObject(param || {});
                    if ((q as any).name) {
                        (q as any).name_like = (q as any).name;
                        delete (q as any).name;
                    }
                    run(() => client(['projects', { data: q }]));
                }}
            >
                retry
            </Button>
            <SearchPannel param={param} setParam={setParam} users={users} />
            {isLoading && (!filteredList || filteredList.length === 0) ? (
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: 240 }}>
                    <Spin size="large" />
                    <div style={{ marginTop: 12, color: '#8c8c8c' }}>正在加载项目，请稍候…</div>
                </div>
            ) : (
                <List
                    refresh={() => {
                        const q = cleanObject(param || {});
                        if ((q as any).name) {
                            (q as any).name_like = (q as any).name;
                            delete (q as any).name;
                        }
                        return run(() => client(['projects', { data: q }]));
                    }}
                    list={filteredList}
                    users={users}
                    loading={isLoading}
                />
            )}
        </Container>
    );
};

ProjectListScreen.whyDidYouRender=true

const Container=styled.div`
    padding:3.2rem
`