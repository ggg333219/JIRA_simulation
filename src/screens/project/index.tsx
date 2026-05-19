import React from 'react';
import { Link } from 'react-router-dom';
import { Route,Routes } from 'react-router-dom';
import { KanbanScreen } from '../kanban';
import { EpicScreen } from '../epic';
import { Navigate } from 'react-router-dom';
export const ProjectScreen = () => {
    return <div>
        <h1>ProjectScreen</h1>
        <Link to='./kanban'>看板</Link>
        <Link to='./epic'>任务组</Link>
        <Routes>
            {/* <Route path='/' element={<Navigate to='kanban' replace />} /> */}
            <Route path='kanban' element={<KanbanScreen/>}/>
            <Route path='epic' element={<EpicScreen/>}/>

            
        </Routes>
    </div>;
};
