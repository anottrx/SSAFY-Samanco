import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  studyList: [],
  studyDetail: {},
  studyFilterList: null,
  myStudy: null,
  userList: null,
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
    },
    setStudyFilterList: (state, action) => {
      state.studyFilterList = action.payload.list;
    },
    setMyStudy: (state, action) => {
      state.myStudy = action.payload.study;
    },
    setUserList: (state, action) => {
      state.userList = action.payload.list;
    },
  },
});

export const {
  setStudyList,
  setStudyDetail,
  setStudyFilterList,
  setMyStudy,
  setUserList,
} = counterSlice.actions; // 액션 생성함수
export default counterSlice.reducer; // 리듀서
