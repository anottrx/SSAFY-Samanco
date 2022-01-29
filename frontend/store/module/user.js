import { createSlice } from '@reduxjs/toolkit'; 

const initialState = {
    project: [],
}; 

const counterSlice = createSlice({ 
    name: 'user', 
    initialState, 
    reducers: { 
        setProject : (state, action) => { 
            state.project = action.payload.project; 
        }, 
    }, 
}); 

export const { setProject } = counterSlice.actions;
export default counterSlice.reducer; 
