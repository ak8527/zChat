import { createAsyncThunk } from '@reduxjs/toolkit';

import axios from '../../client/axios';

export const postUserInfo = createAsyncThunk(
  'user/userInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('user/userInfo');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getSearchUser = createAsyncThunk(
  'user/search',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.get(`user/searchUser?name=${data}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const postUpdateUserInfo = createAsyncThunk(
  'user/updateUserInfo',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.patch('user/userInfo', data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
