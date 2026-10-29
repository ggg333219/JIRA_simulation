import React from 'react';
import { ProjectListScreen } from './screens/project-list';
import { useAuth } from './context/auth-context';
import styled from '@emotion/styled';
import { ButtonNoPadding, Row } from './components/lib';
import {ReactComponent as SoftwareLogo} from './assets/software-logo.svg'
import { Button, Dropdown } from 'antd';
import { resetRoute, useDocumentTitle } from './utils';
import { Navigate, Route, Routes } from 'react-router-dom'
import { ProjectScreen } from './screens/project/index';
import { BrowserRouter } from 'react-router-dom';
import { useState } from 'react';
import { ProjectModal } from './screens/project-list/project-modal';
import { Project } from './types/project';
import { ProjectPopover } from './components/project-popover';
import { UserPopover } from './components/user-popover';



export const AuthenticatedApp = () => {
  const [projectModalOpen,setProjectModalOpen]=useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const { logout ,user} = useAuth()
  
  
  useDocumentTitle('项目列表')
    return (
      <BrowserRouter>
        <Container>
          <PageHeader />
          <Main>
            <Routes>
              <Route path='/' element={<Navigate to='/projects' replace />} />
              <Route path='/projects' element={<ProjectListScreen />} />
              <Route path='/projects/:projectId/*' element={<ProjectScreen />} />
            </Routes>
          </Main>
          <ProjectModal/>
        </Container>
      </BrowserRouter>
    )
  }

const PageHeader = () =>{
  const { logout ,user} = useAuth()
  return (
      <Header between={true} >
                <HeaderLeft gap={true}>
                  <ButtonNoPadding type='link' onClick={resetRoute}>
                    <SoftwareLogo width={'18rem'} color={'rgb(38,132,255'}/>
                  </ButtonNoPadding>
                  <ProjectPopover>
                    <span>项目</span>
                  </ProjectPopover>
                  <UserPopover />

                </HeaderLeft>
                <HeaderRight>
                    <Dropdown
  menu={{
    items: [
      {
        label: '退出登录',
        key: 'logout',
        onClick: logout,
      },
    ],
  }}
>

  <a onClick={e => e.preventDefault()}>
    Hi, {user?.name} ▼
  </a>
</Dropdown>
                </HeaderRight>
            </Header>
  )
}




const Container=styled.div`
    display:grid;
  grid-template-rows:6rem minmax(0, 1fr);
  height:100%;
  overflow:hidden;
`
const Header=styled(Row)`
padding:3.2rem;
box-shadow:0 0 5px 0 rgba(0,0,0,0.1);
z-index:1;
`


const HeaderLeft=styled(Row)`
`
const HeaderRight=styled.div``;
const Main=styled.main`
display:flex;
flex-direction:column;
overflow:hidden;
min-height:0;
`;
