import axios from 'axios';

import { getRefreshToken } from '../store/auth/authMiddleware';

let store;

export const injectStore = (_store) => {
  store = _store;
};

const client = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
});

client.interceptors.request.use(
  (config) => {
    if (!config.url.includes('auth')) {
      const token = store.getState().auth.accessToken;
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

client.interceptors.response.use(
  (res) => res,
  async (err) => {
    console.log('Error:', err);
    const originalConfig = err.config;
    if (!originalConfig.url.includes('auth') && err.response) {
      if (err.response.status === 401 && !originalConfig._retry) {
        try {
          originalConfig._retry = true;
          const response = await store.dispatch(getRefreshToken()).unwrap();
          originalConfig.headers[
            'Authorization'
          ] = `Bearer ${response.data.accessToken}`;
          return axios(originalConfig);
        } catch (err) {
          return Promise.reject(err);
        }
      }
    }
    return Promise.reject(err);
  }
);

export default client;
