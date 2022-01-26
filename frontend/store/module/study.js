import { createSlice } from '@reduxjs/toolkit'; 

const initialState = {
    studyList: [],
    studyDetail: {},
}; // 초기 상태 정의 

// counterSlice : action과 reducer를 한번에 정의
const counterSlice = createSlice({ 
    name: 'study', 
    initialState, 
    reducers: { 
        setStudyList: (state, action) => { 
            state.studyList = action.payload.list; 
        }, 
        setStudyDetail: (state, action) => { 
            state.studyDetail = action.payload.detail; 
        }
    }, 
}); 

export const { setStudyList, setStudyDetail } = counterSlice.actions; // 액션 생성함수 
export default counterSlice.reducer; // 리듀서
