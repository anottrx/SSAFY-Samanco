import { combineReducers } from "@reduxjs/toolkit"; 
import { HYDRATE } from "next-redux-wrapper"; 
import project from './project';
import study from "./study"; 
import meeting from "./meeting";
import board from "./board";

const reducer = (state, action) => { 
    if (action.type === HYDRATE) { 
        return { ...state, ...action.payload }; 
    }
    
    return combineReducers({ 
        project, 
        meeting,
        board,
        study
        // 여기에 추가 
    })(state, action); 
} 

export default reducer;
