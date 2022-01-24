import { createSlice } from '@reduxjs/toolkit'; 

const initialState = {
    boardList: [],
    boardDetail: {},
}; 

const counterSlice = createSlice({ 
    name: 'board', 
    initialState, 
    reducers: { 
        setBoardList: (state, action) => { 
            state.boardList = action.payload.list; 
        }, 
        setBoardDetail: (state, action) => { 
            state.boardDetail = action.payload.detail; 
        }
    }, 
}); 

export const { setBoardList, setBoardDetail } = counterSlice.actions;
export default counterSlice.reducer; 
