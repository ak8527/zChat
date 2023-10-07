import { createSlice } from '@reduxjs/toolkit';

import {
  postLogin,
  postSignup,
  getRefreshToken,
  postForgotPassword,
  postResetPassword,
} from './authMiddleware';

const initialState = {
  accessToken: null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthError: (state, { payload }) => {
      state.error = payload?.data?.message;
    },
    resetAuthState: (state) => {
      state.error = null;
      state.accessToken = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postLogin.fulfilled, (state, { payload }) => {
        state.accessToken = payload?.data?.accessToken;
        state.error = null;
      })
      .addCase(postLogin.rejected, (state, { payload }) => {
        state.error = payload?.data?.message;
      })
      .addCase(postSignup.rejected, (state, { payload }) => {
        state.error = payload?.data?.message;
      })
      .addCase(getRefreshToken.fulfilled, (state, { payload }) => {
        state.accessToken = payload.data?.accessToken;
        state.error = null;
      })
      .addCase(getRefreshToken.rejected, (state, { payload }) => {
        state.error = payload.data?.message;
        state.accessToken = null;
      })
      .addCase(postForgotPassword.rejected, (state, { payload }) => {
        state.error = payload?.data?.message;
      })
      .addCase(postResetPassword.rejected, (state, { payload }) => {
        state.error = payload?.data?.message;
      });
  },
});

export const authReducer = authSlice.reducer;
export const authActions = authSlice.actions;

export const getAuthError = (state) => state.auth.error;
export const getAccessToken = (state) => state.auth.accessToken;
