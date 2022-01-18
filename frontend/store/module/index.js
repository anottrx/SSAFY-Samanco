import { combineReducers } from "@reduxjs/toolkit"; 
import { HYDRATE } from "next-redux-wrapper"; 
import project from './project'; 

const reducer = (state, action) => { 
    if (action.type === HYDRATE) { 
        return { ...state, ...action.payload }; 
    }
    
    return combineReducers({ 
        project, 
        // 여기에 추가 
    })(state, action); 
} 

export default reducer;
