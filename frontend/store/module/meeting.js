import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  meetingList: [],
  meetingDetail: {},
}; // 초기 상태 정의

// counterSlice : action과 reducer를 한번에 정의
const counterSlice = createSlice({
  name: 'meeting',
  initialState,
  reducers: {
    setMeetingList: (state, action) => {
      state.meetingList = action.payload.list;
    },
    setMeetingDetail: (state, action) => {
      state.meetingDetail = action.payload.detail;
    },
  },
});

export const { setMeetingList, setMeetingDetail } = counterSlice.actions; // 액션 생성함수
export default counterSlice.reducer; // 리듀서
