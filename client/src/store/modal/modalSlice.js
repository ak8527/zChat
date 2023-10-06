import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  src: null,
  title: null,
  isOpen: false,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    showImageModal: (state, { payload }) => {
      state.isOpen = true;
      state.src = payload.src;
      state.title = payload.title;
    },
    closeImageModal: (state) => {
      state.isOpen = false;
      state.src = null;
      state.title = null;
    },
  },
});

export const modalActions = modalSlice.actions;
export const modalReducer = modalSlice.reducer;

export const getModalState = (state) => state.modal;
