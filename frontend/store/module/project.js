import { createSlice } from '@reduxjs/toolkit'; 

const initialState = {
    projectList: [],
    projectDetail: {},
}; // 초기 상태 정의 

// counterSlice : action과 reducer를 한번에 정의
const counterSlice = createSlice({ 
    name: 'project', 
    initialState, 
    reducers: { 
        setProjectList: (state, action) => { 
            state.projectList = action.payload.list; 
        }, 
        setProjectDetail: (state, action) => { 
            state.projectDetail = action.payload.detail; 
        }
    }, 
}); 

export const { setProjectList, setProjectDetail } = counterSlice.actions; // 액션 생성함수 
export default counterSlice.reducer; // 리듀서
