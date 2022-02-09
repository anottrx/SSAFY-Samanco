import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  meetingList: [],
  meetingDetail: {},
  publisherStatus: null,
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
    setPublisherStatus: (state, action) => {
      state.publisherStatus = action.payload.status;
    },
  },
});

export const { setMeetingList, setMeetingDetail, setPublisherStatus } =
  counterSlice.actions; // 액션 생성함수
export default counterSlice.reducer; // 리듀서
