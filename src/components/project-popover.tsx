import { Divider, List, Popover, Typography } from 'antd';
import React from 'react';
import styled from '@emotion/styled';
import { useDispatch } from 'react-redux';
import { useProjects } from '../utils/project';
import { projectListActions } from '../screens/project-list/project-list.slice';
import { ButtonNoPadding } from './lib';

type ProjectPopoverProps = {
  children: React.ReactNode;
  projectButton?: React.ReactNode;
};

export const ProjectPopover = ({ children, projectButton }: ProjectPopoverProps) => {
  const dispatch = useDispatch();
  const { data: projects } = useProjects();
  const pinnedProjects = projects?.filter((project) => project.pin) ?? [];

  const defaultProjectButton = (
    <ButtonNoPadding onClick={() => dispatch(projectListActions.openProjectModal())} type="link">
      创建项目
    </ButtonNoPadding>
  );

  const content = (
    <ContentContainer>
      <Typography.Text type="secondary">收藏项目</Typography.Text>
      <List>
        {pinnedProjects.map((project) => (
          <List.Item key={project.id}>
            <List.Item.Meta title={project.name} />
          </List.Item>
        ))}
      </List>
      <Divider />
      {projectButton ?? defaultProjectButton}
    </ContentContainer>
  );

  return (
    <Popover placement="bottom" content={content}>
      {children}
    </Popover>
  );
};

const ContentContainer = styled.div`
  min-width: 30rem;
`;
