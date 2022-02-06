import { createSlice } from '@reduxjs/toolkit'; 

const initialState = {
    project: [],
    userList: [],
    userFilterList: null
}; 

const counterSlice = createSlice({ 
    name: 'user', 
    initialState, 
    reducers: { 
        setProject : (state, action) => { 
            state.project = action.payload.project; 
        }, 
        setUserList : (state, action) => { 
            state.userList = action.payload.list; 
        }, 
        setUserFilterList: (state, action) => {
            state.userFilterList = action.payload.list;
        },
    }, 
}); 

export const { setProject, setUserList, setUserFilterList } = counterSlice.actions;
export default counterSlice.reducer; 
