import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  project: [],
  userList: [],
  userFilterList: null,
  loginInfo: {}
};

const counterSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProject: (state, action) => {
      state.project = action.payload.project;
    },
    setUserList: (state, action) => {
      state.userList = action.payload.list;
    },
    setUserFilterList: (state, action) => {
      state.userFilterList = action.payload.list;
    },
    setLoginInfo: (state, action) => {
      state.loginInfo = action.payload.loginInfo;
    }
  },
});

export const { setProject, setUserList, setUserFilterList, setLoginInfo } =
  counterSlice.actions;
export default counterSlice.reducer;
