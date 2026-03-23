import { createSlice } from "@reduxjs/toolkit";

const initialState: { isLogin: boolean } = {
  isLogin: false,
};

const authReducer = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state) => {
      state.isLogin = true;
    },
    logout: (state) => {
      state.isLogin = false;
    },
  },
});

export const { loginSuccess, logout } = authReducer.actions;
export default authReducer.reducer;
