import { createSlice } from '@reduxjs/toolkit'; 

const initialState = {
    boardList: [],
    boardDetail: {},
    boardFilterList: null,
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
        },
        setBoardFilterList: (state, action) => {
            state.boardFilterList = action.payload.list;
        },
    }, 
}); 

export const { setBoardList, setBoardDetail, setBoardFilterList } = counterSlice.actions;
export default counterSlice.reducer; 
