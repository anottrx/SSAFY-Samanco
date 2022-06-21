import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  applyList: [],
};

const counterSlice = createSlice({
  name: 'apply',
  initialState,
  reducers: {
    setApplyList: (state, action) => {
      state.applyList = action.payload.list;
    },
  },
});

export const { setApplyList } = counterSlice.actions;
export default counterSlice.reducer;
