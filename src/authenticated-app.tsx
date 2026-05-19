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
import { Project } from './screens/project-list/list';
import { ProjectPopover } from './components/project-popover';



export const AuthenticatedApp = () => {
  const [projectModalOpen,setProjectModalOpen]=useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const { logout ,user} = useAuth()
  const projectButton = (
    <ButtonNoPadding onClick={() => setProjectModalOpen(true)} type="link">
      创建项目
    </ButtonNoPadding>
  )
  
  useDocumentTitle('项目列表')
    return (
        <Container>
            <PageHeader projectButton={projectButton} />
            <Main>
                <BrowserRouter>
                    <Routes>
                        <Route path='/' element={<Navigate to='/projects' replace />} />
                        <Route path='/projects' element={<ProjectListScreen projectButton={projectButton} setProjectModalOpen={setProjectModalOpen} setEditingProject={setEditingProject} />} />
                        <Route path='/projects/:projectId/*' element={<ProjectScreen />} />
                    </Routes>
                </BrowserRouter>
                  
                
                
            </Main>
            <ProjectModal projectModalOpen={projectModalOpen} editingProject={editingProject} onClose={()=>{
              setProjectModalOpen(false)
              setEditingProject(null)
            }}/>
        </Container>
    )
  }
const PageHeader=(props:{projectButton:React.ReactNode})=>{
  const { logout ,user} = useAuth()
  return (
      <Header between={true} >
                <HeaderLeft gap={true}>
                  <ButtonNoPadding type='link' onClick={resetRoute}>
                    <SoftwareLogo width={'18rem'} color={'rgb(38,132,255'}/>
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
        label: '退出登录',        // 修改：把 'key' 改成有意义的文字
        key: 'logout',
        onClick: logout,          // 可直接在 menu 里绑定
      },
    ],
  }}
>
  {/* 只保留一个子元素作为触发器 */}
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
    grid-template-rows:6rem calc(100vh-6rem);
`
const Header=styled(Row)`
padding:3.2rem;
box-shadow:0 0 5px 0 rgba(0,0,0,0.1);
z-index:1;
`


const HeaderLeft=styled(Row)`
`
const HeaderRight=styled.div``;
const Main=styled.main``;