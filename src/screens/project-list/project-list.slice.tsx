// 切片，管project-list相关的
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store/index.tsx";

interface State{
    projectModalOpen:boolean;
}

const initialState:State ={
    projectModalOpen:false
}

export const projectListSlice =createSlice({
    name:'projectListSlice',
    initialState,
    reducers:{
        openProjectModal(state){
            state.projectModalOpen=true
        },
        closeProjectModal(state){
            state.projectModalOpen=false
            
        }
    }
})

export const projectListActions=projectListSlice.actions

export const selectProjectModalOpen=(state:RootState)=>state.projectList.projectModalOpen