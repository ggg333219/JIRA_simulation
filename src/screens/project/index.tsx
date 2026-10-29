import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Route,Routes } from 'react-router-dom';
import { KanbanScreen } from '../kanban';
import { EpicScreen } from '../epic';
import { Navigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { Menu } from 'antd';

const useRouteType=()=>{
    const units=useLocation().pathname.split('/')
    return units.length-1
}

export const ProjectScreen = () => {
    const routeType=useRouteType()
    return <Container>
        <Aside>
            <Menu mode="inline" selectedKeys={[String(routeType)]}>
                <Menu.Item key="kanban">
                    <Link to='./kanban'>看板</Link>
                </Menu.Item>
                <Menu.Item key="epic">
                    <Link to='./epic'>任务组</Link>
                </Menu.Item>
            </Menu>    
        </Aside>

        <Main>
            <Routes>
                <Route index element={<Navigate to='kanban' replace />} />
                <Route path='kanban' element={<KanbanScreen/>}/>
                <Route path='epic' element={<EpicScreen/>}/>

            
            </Routes>
        </Main>
        
    </Container>;
};

const Aside=styled.aside`
    background-color:rgb(244,245,247);
    display:flex;
    height:100%;
    overflow:hidden;
`

const Main=styled.div`
    box-shadow:-5px 0 5px rgba(0,0,0,0.1);
    display:flex;
    height:100%;
    min-height:0;
    overflow:hidden;
`
const Container=styled.div`
    display:grid;
    grid-template-columns:16rem 1fr;
    height:100%;
    min-height:0;
    overflow:hidden;
`