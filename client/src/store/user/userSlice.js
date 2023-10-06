import { createSlice } from '@reduxjs/toolkit';

import { postUserInfo, postUpdateUserInfo } from '../user/userMiddleware';

const initialState = {
  userId: null,
  username: null,
  email: null,
  imageUrl: null,
  error: null,
  success: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserError: (state, { payload }) => {
      state.error = payload?.data?.message;
    },
    setResponse: (state, { payload }) => {
      state.error = null;
      state.success = null;
    },
    resetUserState: (state) => {
      state.userId = null;
      state.username = null;
      state.email = null;
      state.imageUrl = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postUserInfo.fulfilled, (state, { payload }) => {
        state.userId = payload.data?.userId;
        state.username = payload.data?.username;
        state.email = payload.data?.email;
        state.imageUrl = payload.data?.imageUrl;
        state.success = null;
        state.error = null;
      })
      .addCase(postUserInfo.rejected, (state, { payload }) => {
        state.error = payload.data?.message;
        state.success = null;
      })
      .addCase(postUpdateUserInfo.fulfilled, (state, { payload }) => {
        state.imageUrl = payload.data?.imageUrl;
        state.username = payload.data?.username;
        state.error = null;
        state.success = 'User updated successfully';
      });
  },
});

export const userActions = userSlice.actions;
export const userReducer = userSlice.reducer;

export const getEmail = (state) => state.user.email;
export const getUserId = (state) => state.user.userId;
export const getUserName = (state) => state.user.username;
export const getImageUrl = (state) => state.user.imageUrl;
export const getUserInfo = (state) => state.user;
export const getUserError = (state) => state.user.error;
export const getUserSuccess = (state) => state.user.success;
