import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  project: [],
  userList: [],
  userDetail: {},
  loginInfo: {},
  registInfo: {},
  adminUserId: null,
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
    setUserDetail: (state, action) => {
      state.userDetail = action.payload.detail;
    },
    setLoginInfo: (state, action) => {
      state.loginInfo = action.payload.loginInfo;
    },
    setRegistInfo: (state, action) => {
      state.registInfo = action.payload.registInfo;
    },
    setAdminUserId: (state, action) => {
      state.adminUserId = action.payload.adminUserId;
    },
  },
});

export const {
  setProject,
  setUserList,
  setUserDetail,
  setLoginInfo,
  setRegistInfo,
  setAdminUserId,
} = counterSlice.actions;
export default counterSlice.reducer;
