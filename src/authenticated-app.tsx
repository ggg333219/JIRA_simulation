import React from 'react';
import styled from '@emotion/styled';
import { Dropdown } from 'antd';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ButtonNoPadding, Row } from './components/lib';
import { useAuth } from './context/auth-context';
import { ReactComponent as SoftwareLogo } from './assets/software-logo.svg';
import { ProjectPopover } from './components/project-popover.tsx';
import { ProjectScreen } from './screens/project/index';
import { ProjectListScreen } from './screens/project-list';
import { ProjectModal } from './screens/project-list/project-modal';
import { projectListActions } from './screens/project-list/project-list.slice';
import { resetRoute, useDocumentTitle } from './utils';

export const AuthenticatedApp = () => {
  const dispatch = useDispatch();

  const projectButton = (
    <ButtonNoPadding onClick={() => dispatch(projectListActions.openProjectModal())} type="link">
      创建项目
    </ButtonNoPadding>
  );

  useDocumentTitle('项目列表');

  return (
    <Container>
      <PageHeader projectButton={projectButton} />
      <Main>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Navigate to='/projects' replace />} />
            <Route path='/projects' element={<ProjectListScreen />} />
            <Route path='/projects/:projectId/*' element={<ProjectScreen />} />
          </Routes>
        </BrowserRouter>
      </Main>
      <ProjectModal />
    </Container>
  );
};

const PageHeader = (props: { projectButton: React.ReactNode }) => {
  const { logout, user } = useAuth();

  return (
    <Header between={true}>
      <HeaderLeft gap={true}>
        <ButtonNoPadding type='link' onClick={resetRoute}>
          <SoftwareLogo width={'18rem'} color={'rgb(38,132,255'} />
        </ButtonNoPadding>
        <ProjectPopover projectButton={props.projectButton}>
          <span>项目</span>
        </ProjectPopover>
        <span>用户</span>
      </HeaderLeft>
      <HeaderRight>
        <Dropdown
          menu={{
            items: [
              {
                label: 'Logout',
                key: 'logout',
                onClick: logout,
              },
            ],
          }}
        >
          <a onClick={(e) => e.preventDefault()}>Hi, {user?.name}</a>
        </Dropdown>
      </HeaderRight>
    </Header>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-rows: 6rem calc(100vh - 6rem);
`;

const Header = styled(Row)`
  padding: 3.2rem;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
  z-index: 1;
`;

const HeaderLeft = styled(Row)``;
const HeaderRight = styled.div``;
const Main = styled.main``;
