import React from 'react';
import { Button, List, Popover, Spin, Typography } from 'antd';
import styled from '@emotion/styled';
import { useUsers } from '../utils/user';

export const UserPopover = () => {
    const { data: users = [], error, isLoading, refetch } = useUsers();

    const content = (
        <ContentContainer>
            <Typography.Text type="secondary">组员列表</Typography.Text>
            {error ? (
                <div>
                    <Typography.Text type="danger">加载组员失败：{error.message}</Typography.Text>
                    <Button type="link" onClick={() => { void refetch(); }}>重试</Button>
                </div>
            ) : isLoading ? (
                <Spin />
            ) : (
                <List
                    size="small"
                    dataSource={users}
                    locale={{ emptyText: '暂无组员' }}
                    renderItem={(user) => <List.Item key={user.id}>{user.name}</List.Item>}
                />
            )}
        </ContentContainer>
    );

    return (
        <Popover
            trigger="click"
            placement="bottom"
            content={content}
            onOpenChange={(open) => { if (open) void refetch(); }}
        >
            <Button type="link" style={{ padding: 0 }}>组员</Button>
        </Popover>
    );
};

const ContentContainer = styled.div`
    min-width: 20rem;
    max-height: 30rem;
    overflow-y: auto;
`;
