import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  boardList: [],
  boardDetail: {},
  boardFilterList: null,
  comment: [],
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
    setComment: (state, action) => {
      state.comment = action.payload.comment;
    },
  },
});

export const { setBoardList, setBoardDetail, setBoardFilterList, setComment } =
  counterSlice.actions;
export default counterSlice.reducer;
